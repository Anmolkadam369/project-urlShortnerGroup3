
function isValidLink(longUrl) {
    // const pattern = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
    const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return pattern.test(longUrl);
  }
module.exports.isValidLink=isValidLink;