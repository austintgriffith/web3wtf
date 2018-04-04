const fs = require("fs")
const awsCreds = JSON.parse(fs.readFileSync("aws.json").toString().trim())
var s3 = require('s3');
var client = s3.createClient({
  s3Options: awsCreds,
});
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
var params = {
  localDir: "build",
  s3Params: {
    Bucket: "web3.wtf",
    Prefix: "",
    ACL: "public-read"
  },
};
const { exec } = require('child_process');
console.log("BUILDING AND DEPLOYING TO web3.wtf -- run: 'node invalidate.js' to invalidate the cloudfront cache...")
console.log("npm run build")
exec('npm run build', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    if(err){
      console.log("ERROR ON BUILD",err)
    }
    return;
  }
  console.log(`${stdout}`);
  console.log(`${stderr}`);
  fs.readdir( params.localDir , function( err, files ) {
      if( err ) {
          console.error( "Could not list the directory.", err );
          process.exit( 1 );
      }
      var uploader = client.uploadDir(params);
      uploader.on('error', function(err) {
        console.error("unable to sync:", err.stack);
      });
      uploader.on('progress', function() {
        console.log("progress", uploader.progressAmount, uploader.progressTotal);
      });
      uploader.on('end', function() {
        console.log("done uploading");
      });
  })
});
