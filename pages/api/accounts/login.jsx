import nextConnect from "next-connect";
import middleware from "../../middleware/database";
import * as bcrypt from "bcrypt";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  let { email, password } = req.body;
  let user = { email, password };
  // Verify all fields are filled
  if (!email || !password) {
    return res.status(400).json({
      error: "Please fill in all fields",
    });
  }
  // Verify the email is in the format of email
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(email)) {
    return res.status(400).json({ error: "Email is invalid" });
  }
  // Verify the password is at least 8 characters long, contains a number, and contains a special character
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    return res.status(400).json({ error: "Password is invalid" });
  }
  // Verify the account exists
  const doc = await req.db.collection("users").findOne({ email });
  if (!doc) {
    return res.status(400).json({ error: "Account does not exist" });
  }
  // Verify the password is correct
  const isMatch = await bcrypt.compare(password, doc.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Password is incorrect" });
  }
  // Add new session to databse
  const session = await req.db.collection("sessions").insertOne({
    user: doc,
    createdAt: new Date(),
  });
  if (session.acknowledged) {
    res.json({ msg: "Login successful", session: session.insertedId });
  }
});

export default handler;
