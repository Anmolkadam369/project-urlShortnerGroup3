
function isValidLink(longUrl) {
    const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return pattern.test(longUrl);
  }

module.exports.isValidLink=isValidLink;