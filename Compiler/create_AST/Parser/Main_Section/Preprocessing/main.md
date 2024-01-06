Preprocessing does the following:

Edit the tokens (inside the token_walker) to ease later processing. The following things are done:

Remove Comments and Transition Text
If no SECTION_SEPERATOR token is at the beginning, than add one
Replace all H1-H6  with the corresponding Tags
Replace List Items with the corresponding Tags (making sure the things inside them stay inside, given "\")
Add List opening and closing around list items