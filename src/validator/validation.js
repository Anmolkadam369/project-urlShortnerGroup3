
const isValidLink = function(longUrl){
    const regexLink =/^https?:\/\/(.+\/)+.+$/i
    // const regexLink=/^(https?:\\/\\/)?'+
    // '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
    // '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
    // '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
    // '(\\?[;&a-z\\d%_.~+=-]*)?'+
    // '(\\#[-a-z\\d_]*)?$'/
    return regexLink.test(longUrl)
}
module.exports.isValidLink=isValidLink;