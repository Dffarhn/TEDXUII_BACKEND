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


// Function to delete an image
async function deleteImage(filePath) {
  try {
    const { data, error } = await supabase
      .storage
      .from("TEDXUII")
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return data; // Return the data from the deletion operation
  } catch (error) {
    console.error('Error deleting image:', error.message);
    return null; // Return null if there's an error
  }
}

// Example usage for deleting an image
async function DeleteImage(filepath) {
  const filePath = filepath;

  const deleteResult = await deleteImage(filePath);
  if (deleteResult) {
    return deleteResult;
  } else {
    throw new Error('Error deleting image');
  }
}

module.exports = {GenerateSignedUrl,DeleteImage}