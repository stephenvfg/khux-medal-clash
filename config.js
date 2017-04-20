module.exports = {
  database: process.env.MONGODB_URI || 'localhost/kmc',
  secret: process.env.SECRET,
  aws_key: process.env.AWS_ACCESS_KEY_ID,
  aws_secret: process.env.AWS_SECRET_ACCESS_KEY,
  s3_bucket: process.env.S3_BUCKET
};