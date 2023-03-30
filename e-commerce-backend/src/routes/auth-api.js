import express from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import Users from "../models/Users";
import UserRole from "../models/UserRole";

const authApi = express.Router();

authApi.post("/register", async (request, response) => {
  const data = request.body;
  console.log(request.body);

  if (data) {
    const oldUser = await Users.findOne({ email: data.email });
    if (oldUser) {
      return response.status(400).json({
        success: false,
        status: "Хэрэглэгч аль хэдийн үүссэн байна. Нэвтэрч орно уу.",
      });
    }
    var hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    try {
      const user = await Users.create(data);
      const result = await user.populate("userrole");
      response.status(201).json({
        message: "Хэрэглэгч амжилттай үүслээ",
        data: result,
      });
      return;
    } catch (error) {
      response.status(500).json({
        success: false,
        error: error,
      });
      return;
    }

    // Users.create(data)
    //   .then((data) => {
    //     response.status(201).json({
    //       message: "Хэрэглэгч амжилттай үүслээ",
    //       data,
    //     });
    //     return;
    //   })
    //   .catch((error) => {
    //     return response.status(500).json({
    //       success: false,
    //       error,
    //     });
    //   });
  } else {
    return response.json({
      error: "Input field is empty",
    });
  }
});

authApi.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!(email && password)) {
      return response.status(400).json({
        message: "Утгуудыг бүрэн оруулна уу",
      });
    }

    const user = await Users.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user?.password);
      if (user && isMatch) {
        const jwtBody = {
          user_id: user._id,
          email: email,
        };

        const token = jwt.sign(jwtBody, "MySuperDuperPrivateKey", {
          expiresIn: "24h",
        });
        response.status(200).json({
          success: true,
          data: user,
          token: token,
          status: "Амжилттай холбогдлоо",
        });
        return;
      }
    } else {
      response.status(400).json({
        success: false,
        status: "Нууц үг нэр хоорондоо таарахгүй байна",
      });
      return;
    }
  } catch (err) {
    response.status(500).json({
      data: "Алдаа гарлаа",
      error: err,
    });
    return;
  }
});

authApi.post("/role/create", async (req, res) => {
  const { name } = req.body;
  const result = await UserRole.create({ name });
  res.status(200).json({ data: result });
});

authApi.get("/role/list", async (req, res) => {
  const result = await UserRole.find({});
  res.status(200).json({ data: result });
});

module.exports = authApi;
