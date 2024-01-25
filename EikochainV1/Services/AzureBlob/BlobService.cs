using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace EikochainV1.Services
{
    public class BlobStorageService
    {
        private const string UriString = "https://eikochainimages.blob.core.windows.net/";
        private const string strContainerName = "uploads";
        string accessKey = string.Empty;
        private readonly Uri _baseUri = new Uri(UriString);
        private CloudStorageAccount cloudStorageAccount;
        private CloudBlobClient cloudBlobClient;
        private CloudBlobContainer container;

        public BlobStorageService(IConfiguration config)
        {
            accessKey = config.GetConnectionString("EikochainImages");
            cloudStorageAccount = CloudStorageAccount.Parse(accessKey);
            cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
            container = cloudBlobClient.GetContainerReference(strContainerName);
        }

        public async Task<string> UploadImageAsync(IFormFile imageFile, string fileUploadName)
        {
            try
            {
                using (StreamReader streamReader = new StreamReader(imageFile.OpenReadStream()))
                {
                    var blob = container.GetBlockBlobReference(fileUploadName);
                    await blob.UploadFromStreamAsync(streamReader.BaseStream);
                    return new Uri(_baseUri, $"/uploads/{fileUploadName}").ToString();
                }

            }
            catch (Exception exception)
            {
                return exception.Message;
            }

        }

        public async Task<string> UploadVideoAsync(IFormFile imageFile, string fileUploadName)
        {
            try
            {
                using (StreamReader streamReader = new StreamReader(imageFile.OpenReadStream()))
                {
                    var blob = container.GetBlockBlobReference(fileUploadName);
                    await blob.UploadFromStreamAsync(streamReader.BaseStream);
                    return new Uri(_baseUri, $"/uploads/{fileUploadName}").ToString();
                }

            }
            catch (Exception exception)
            {
                throw;
            }

        }

        public async void DeleteBlobData(string fileUrl)
        {
            Uri uriObj = new Uri(fileUrl);
            string BlobName = Path.GetFileName(uriObj.LocalPath);

            CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(accessKey);
            CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
            string strContainerName = "uploads";
            CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(strContainerName);

            string pathPrefix = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd") + "/";
            CloudBlobDirectory blobDirectory = cloudBlobContainer.GetDirectoryReference(pathPrefix);
            // get block blob refarence    
            CloudBlockBlob blockBlob = blobDirectory.GetBlockBlobReference(BlobName);

            // delete blob from container        
            await blockBlob.DeleteAsync();
        }


    }
}