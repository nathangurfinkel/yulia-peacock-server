pdffiller = require("pdffiller");
// Load the en_core_web_sm model
import spacy from "spacy";
const nlp = spacy.load("en_core_web_sm");

exports.handler = function (event, context, callback) {
  // Extract the PDF data from the request body
  const pdfData = event.body;
  // Extract the text from the PDF
  pdffiller.read(pdfData, "UTF-8", (err, text) => {
    if (err) {
      return callback(err);
    }
    // Extract the named entities from the text
    const doc = nlp(text);
    // Initialize an empty dictionary
    const data = {
      name: "",
      email: "",
      summary: "",
      skills: [],
      activities: [],
      awards: [],
      experience: [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        { school: "", degree: "", startDate: "", endDate: "", description: "" },
      ],
      phone: "",
    };
    // Iterate through the named entities
    doc.ents.forEach((ent) => {
      // Check if the entity label is a person name
      if (ent.label_ === "PERSON") {
        // Add the person name to the dictionary
        data.name = ent.text;
      } else if (ent.label_ === "EMAIL") {
        // Add the email address to the dictionary
        data.email = ent.text;
      } else if (ent.label_ === "PHONE") {
        // Add the phone number to the dictionary
        data.phone = ent.text;
      } else if (ent.label_ === "ORG") {
        // Add the organization to the experience field in the dictionary
        data.experience.push({
          company: ent.text,
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        });
      } else if (ent.label_ === "DATE") {
        // Extract the start and end dates from the entity text
        const [startDate, endDate] = ent.text.split("-");
        // Add the start and end dates to the experience field in the dictionary
        data.experience[data.experience.length - 1].startDate = startDate;
        data.experience[data.experience.length - 1].endDate = endDate;
      }
    });
    // Return the parsed data as a response object
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(data),
    });
  });
};
