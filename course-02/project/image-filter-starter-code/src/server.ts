import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get("/filteredimage", async (req, res) => {
    const { image_url } = req.query as { image_url: string };

    console.log(`captured ${image_url}`);

    if (!image_url) {
      return res.status(400).send("please provide an image_url");
    }

    let filename: string;
    
    try {
      filename = await filterImageFromURL(image_url);
    } catch (error) {
      console.error(error);
      return res.status(400).send('could not process image');
    }

    res.sendFile(filename, {}, async (err) => {
      await deleteLocalFiles([filename]);
    });
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
