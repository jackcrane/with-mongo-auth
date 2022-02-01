import nextConnect from "next-connect";
import middleware from "../../middleware/database";
import * as bcrypt from "bcrypt";

const handler = nextConnect();

handler.use(middleware);

// handler.get(async (req, res) => {
//   // let doc = await req.db.collection("projects").find().toArray();
//   let doc = await redis.get("users");
//   res.json(doc);
// });

handler.post(async (req, res) => {
  let { name, email, password } = req.body;
  let user = { name, email, password };
  // Verify all fields are filled
  if (!name || !email || !password) {
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
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }
  // Verify if user already exists
  let vdoc = await req.db.collection("users").findOne({ email });
  if (vdoc) {
    return res.status(400).json({ error: "User already exists" });
  }
  let doc = await req.db.collection("users").insertOne(user);
  if (doc.acknowledged) {
    res.redirect("/api/accounts/login");
    // res.json({ msg: "User created successfully" });
  } else {
    res.status(500).json({ msg: "User creation failed" });
  }
});

export default handler;
