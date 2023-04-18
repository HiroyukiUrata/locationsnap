import { useState } from "react";
import { useS3Upload } from "next-s3-upload";

export default function UploadComponent() {
  let [imageUrl, setImageUrl] = useState();
  let { FileInput, openFileDialog, uploadToS3,files } = useS3Upload();

  let handleFileChange = async file => {
    let { url } = await uploadToS3(file);
    setImageUrl(url);
  };

  return (
    <div class="md:flex flex-col h-screen">
      <FileInput onChange={handleFileChange} />

      <button class="bg-red-300 hover:bg-red-200 text-white rounded px-4 py-2 mx-1 my-1" onClick={openFileDialog}>Upload file</button>
       <div className="pt-8">
         {files.map((file, index) => (
           <div key={index}>
             File #{index} progress: {file.progress}%
           </div>
         ))}
       </div>
      {imageUrl && <img src={imageUrl} />}
    </div>
  );
}

// import { useS3Upload } from "next-s3-upload";
// import { useState } from "react";

// export default function UploadPage() {
//   let { uploadToS3, files } = useS3Upload();

//   let handleFileChange = async event => {
//     let file = event.target.files[0];
//     await uploadToS3(file);
//   };

//   return (
//     <div>
//       <input onChange={handleFileChange} type="file" />

//       <div className="pt-8">
//         {files.map((file, index) => (
//           <div key={index}>
//             File #{index} progress: {file.progress}%
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }