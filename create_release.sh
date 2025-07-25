#!/bin/bash

# release_vue v0.3.0
# 2024-10-19

# Colours for echo
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
PURPLE='\033[0;35m'
RESET='\033[0m'

STAR_LINE='****************************************'
CWD=$(pwd)
BUILD_DATE=$(date "+%a %d %Y %B %T %Z")

# $1 string - error message
error_close() {
	echo -e "\n${RED}ERROR - EXITED: ${YELLOW}$1${RESET}\n"
	exit 1
}

# Check that dialog is installed
if ! [ -x "$(command -v dialog)" ]; then
	error_close "dialog is not installed"
fi

# $1 string - question to ask
# Ask a yes no question, only accepts `y` or `n` as a valid answer, returns 0 for yes, 1 for no
ask_yn() {
	while true; do
		printf "\n%b%s? [y/N]:%b " "${GREEN}" "$1" "${RESET}"
		read -r answer
		if [[ "$answer" == "y" ]]; then
			return 0
		elif [[ "$answer" == "n" ]]; then
			return 1
		else
			echo -e "${RED}\nPlease enter 'y' or 'n'${RESET}"
		fi
	done
}

# ask continue, or quit
ask_continue() {
	if ! ask_yn "continue"; then
		exit
	fi
}

# semver major update
update_major() {
	local bumped_major
	bumped_major=$((MAJOR + 1))
	echo "${bumped_major}.0.0"
}

# semver minor update
update_minor() {
	local bumped_minor
	bumped_minor=$((MINOR + 1))
	MINOR=bumped_minor
	echo "${MAJOR}.${bumped_minor}.0"
}

# semver patch update
update_patch() {
	local bumped_patch
	bumped_patch=$((PATCH + 1))
	PATCH=bumped_patch
	echo "${MAJOR}.${MINOR}.${bumped_patch}"
}

# Get the url of the github repo, strip .git from the end of it
get_git_remote_url() {
	GIT_REPO_URL="$(git config --get remote.origin.url | sed 's/\.git$//')"
}

# Check currently on dev branch & git is clean
check_git() {
	CURRENT_GIT_BRANCH=$(git branch --show-current)
	GIT_CLEAN=$(git status --porcelain)
	if [[ -n $GIT_CLEAN ]]; then
		error_close "git dirty"
	fi
	if [[ ! "$CURRENT_GIT_BRANCH" =~ ^dev$ ]]; then
		error_close "not on dev branch"
	fi
}

# Ask user if current changelog is acceptable
ask_changelog_update() {
	echo "${STAR_LINE}"
	RELEASE_BODY_TEXT=$(sed '/# <a href=/Q' CHANGELOG.md)
	printf "%s" "$RELEASE_BODY_TEXT"
	printf "\n%s\n" "${STAR_LINE}"
	if ask_yn "accept release body"; then
		update_release_body_and_changelog "$RELEASE_BODY_TEXT"
	else
		exit
	fi
}

# Edit the release-body to include new lines from changelog
# add commit urls to changelog
# $1 RELEASE_BODY
update_release_body_and_changelog() {
	echo -e
	DATE_SUBHEADING="### $(date +'%Y-%m-%d')\n\n"
	RELEASE_BODY_ADDITION="${DATE_SUBHEADING}$1"

	# Put new changelog entries into release-body, add link to changelog
	echo -e "${RELEASE_BODY_ADDITION}\n\nsee <a href='${GIT_REPO_URL}/blob/main/CHANGELOG.md'>CHANGELOG.md</a> for more details" >.github/release-body.md

	# Add subheading with release version and date of release
	echo -e "# <a href='${GIT_REPO_URL}/releases/tag/${NEW_TAG_WITH_V}'>${NEW_TAG_WITH_V}</a>\n${DATE_SUBHEADING}${CHANGELOG_ADDITION}$(cat CHANGELOG.md)" >CHANGELOG.md

	# Update changelog to add links to commits [hex:8](url_with_full_commit)
	# "[aaaaaaaaaabbbbbbbbbbccccccccccddddddddd]" -> "[aaaaaaaa](https:/www.../commit/aaaaaaaaaabbbbbbbbbbccccccccccddddddddd)"
	sed -i -E "s=(\s)\[([0-9a-f]{8})([0-9a-f]{32})\]= [\2](${GIT_REPO_URL}/commit/\2\3)=g" CHANGELOG.md

	# Update changelog to add links to closed issues
	# "closes #1" -> "closes [#1](https:/www.../issues/1)""
	sed -i -r -E "s=closes \#([0-9]+)=closes [#\1](${GIT_REPO_URL}/issues/\1)=g" CHANGELOG.md
}

update_json() {
	local json_file="./package.json"
	local json_version_update
	local json_build_update
	json_version_update=$(jq ".version = \"${NEW_TAG_WITH_V:1}\"" "${json_file}")
	json_build_update=$(jq ".buildDate =\"${BUILD_DATE}\"" <<<"${json_version_update}")
	echo "$json_build_update" >"$json_file"
}

# $1 new_version
update_version_number_in_files() {
	update_json
}

# Work out the current version, based on git tags
# create new semver version based on user input
# Set MAJOR MINOR PATCH
check_tag() {
	LATEST_TAG=$(git describe --tags "$(git rev-list --tags --max-count=1)")
	echo -e "\nCurrent tag: ${PURPLE}${LATEST_TAG}${RESET}\n"
	echo -e "${YELLOW}Choose new tag version:${RESET}\n"
	if [[ $LATEST_TAG =~ ^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-((0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(\+([0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*))?$ ]]; then
		IFS="." read -r MAJOR MINOR PATCH <<<"${LATEST_TAG:1}"
	else
		MAJOR="0"
		MINOR="0"
		PATCH="0"
	fi
	OP_MAJOR="major___v$(update_major)"
	OP_MINOR="minor___v$(update_minor)"
	OP_PATCH="patch___v$(update_patch)"
	OPTIONS=("$OP_MAJOR" "$OP_MINOR" "$OP_PATCH")
	select choice in "${OPTIONS[@]}"; do
		case $choice in
		"$OP_MAJOR")
			MAJOR=$((MAJOR + 1))
			MINOR=0
			PATCH=0
			break
			;;
		"$OP_MINOR")
			MINOR=$((MINOR + 1))
			PATCH=0
			break
			;;
		"$OP_PATCH")
			PATCH=$((PATCH + 1))
			break
			;;
		*)
			echo -e "\n\"${REPLY}\" ${RED}- invalid option. Please select 1, 2, or 3.${RESET}"
			continue
			;;

		esac
	done
}

linter() {
	npm run check
	npm run lint
	ask_continue
}

npm_build() {
	npm run build
	ask_continue
}

# $1 text to colourise
release_continue() {
	echo -e "\n${PURPLE}$1${RESET}"
	ask_continue
}

# Check repository for typos
check_typos() {
	echo -e "\n${PURPLE}check typos${RESET}"
	typos
	ask_continue
}

# Full flow to create a new release
release_flow() {
	check_typos

	check_git
	get_git_remote_url

	linter
	npm_build

	cd "${CWD}" || error_close "Can't find ${CWD}"
	check_tag

	NEW_TAG_WITH_V="v${MAJOR}.${MINOR}.${PATCH}"
	printf "\nnew tag chosen: %s\n\n" "${NEW_TAG_WITH_V}"

	RELEASE_BRANCH=release-$NEW_TAG_WITH_V
	echo -e
	ask_changelog_update

	release_continue "checkout ${RELEASE_BRANCH}"
	git checkout -b "$RELEASE_BRANCH"

	release_continue "update_version_number_in_files"
	update_version_number_in_files

	release_continue "git add ."
	git add .

	release_continue "git commit -m \"chore: release \"${NEW_TAG_WITH_V}\""
	git commit -m "chore: release ${NEW_TAG_WITH_V}"

	release_continue "git checkout main"
	git checkout main

	echo -e "${PURPLE}git pull origin main${RESET}"
	git pull origin main

	release_continue "git merge --no-ff \"${RELEASE_BRANCH}\" -m \"chore: merge ${RELEASE_BRANCH} into main\""
	git merge --no-ff "$RELEASE_BRANCH" -m "chore: merge ${RELEASE_BRANCH} into main"

	release_continue "git tag -am \"${RELEASE_BRANCH}\" \"$NEW_TAG_WITH_V\""
	git tag -am "${RELEASE_BRANCH}" "$NEW_TAG_WITH_V"

	release_continue "git push --atomic origin main \"$NEW_TAG_WITH_V\""
	git push --atomic origin main "$NEW_TAG_WITH_V"

	release_continue "git checkout dev"
	git checkout dev

	release_continue "git merge --no-ff main -m \"chore: merge main into dev\""
	git merge --no-ff main -m "chore: merge main into dev"

	release_continue "git push origin dev"
	git push origin dev

	release_continue "git branch -d \"$RELEASE_BRANCH\""
	git branch -d "$RELEASE_BRANCH"

	npm run build
}

main() {
	cmd=(dialog --backtitle "Start ${MONO_NAME} containers" --keep-tite --radiolist "choose" 14 80 16)
	options=(
		1 "lint" off
		2 "build" off
		3 "test" off
		4 "release" off
	)
	choices=$("${cmd[@]}" "${options[@]}" 2>&1 >/dev/tty)
	exitStatus=$?
	clear
	if [ $exitStatus -ne 0 ]; then
		exit
	fi
	for choice in $choices; do
		case $choice in
		0)
			exit
			;;

		1)
			linter
			main
			break
			;;
		2)
			npm_build
			main
			break
			;;
		3)
			npm_test
			main
			break
			;;
		4)
			release_flow
			break
			;;
		esac
	done
}

main
