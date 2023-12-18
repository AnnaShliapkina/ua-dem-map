const fs = require("fs");
const csv = require("csvtojson");

const csvFilePath = "./src/data/new_dataset_DSNS.json"; // Replace with the path to your CSV file
const jsonFilePath = "output.json"; // Replace with the desired output file path

const convertCsvToJson = async () => {
  try {
    const jsonArray = await csv().fromFile(csvFilePath);

    const jsonFormattedArray = jsonArray.map((row) => ({
      coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
      name: row.name,
      class: row.class,
      mass: row.mass,
      year: parseInt(row.year, 10),
      imageUrl: row.imageUrl, // Assuming your CSV has a column named 'imageUrl'
    }));

    const jsonString = JSON.stringify(jsonFormattedArray, null, 2);

    fs.writeFileSync(jsonFilePath, jsonString);

    console.log(`Conversion complete. JSON data saved to ${jsonFilePath}`);
  } catch (error) {
    console.error("Error during conversion:", error.message);
  }
};

convertCsvToJson();
