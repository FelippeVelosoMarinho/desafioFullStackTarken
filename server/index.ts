import app from "./.config/expressConfig";

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});