const { supabase } = require("../../supabaseBucket");
async function generateSignedUrl(filePath, expirationSeconds) {
  try {
    const { data, error } = await supabase
      .storage
      .from("TEDXUII")
      .createSignedUrl(filePath, expirationSeconds);

    if (error) {
      throw error;
    }

    return data.signedUrl; // Return the signed URL
  } catch (error) {
    console.error('Error generating signed URL:', error.message);
    return null; // Return null if there's an error
  }
}

// Example usage:
async function GenerateSignedUrl(filepath, expirationSeconds = 36000) {
  const filePath = filepath;
  const expiration = expirationSeconds ? expirationSeconds : 36000;

  const signedUrl = await generateSignedUrl(filePath, expirationSeconds);
  if (signedUrl) {
    return signedUrl
  } else {
    throw new Error
  }
}

module.exports = {GenerateSignedUrl}