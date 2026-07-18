//this is a temporary test website to test error handling in website crawler
import express from "express";

const app = express();


app.get("/", (req, res)=>{
    res.send(`
        <html>
            <body>
                <h1>Test crawler</h1>

                <a href="/valid">
                    Valid page
                </a>

                <a href="/broken">
                    Broken page
                </a>

            </body>
        </html>
    `);
});


app.get("/valid", (req,res)=>{
    res.send(`
        <html>
            <body>
                <h1>Valid page</h1>
            </body>
        </html>
    `);
});


app.get("/broken", (req,res)=>{
    res.status(404).send("Page not found");
});


app.listen(3000, ()=>{
    console.log("Mock server running on http://localhost:3000");
});