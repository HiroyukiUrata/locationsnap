// export { APIRoute as default } from "next-s3-upload";

import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  key(req, filename) {
    return `images/${filename}`;
  }
});