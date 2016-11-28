$ algo mkdir .my/PicsToFilter

$ algo cp * data://.my/PicsToFilter

$ algo mkdir data://diego/FilteredPics

$ for file in $(algo ls data://diego/PicsToFilter); do algo run deeplearning/DeepFilter -d "{\"images\":[\"data://diego/PicsToFilter/$file\"],\"savePaths\":[\"data://diego/FilteredPics/$file\"],\"filterName\":\"post_modern\"}";done;