export const Verification_Email_Template = `
  <<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>

    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }

      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border: 1px solid #ddd;
      }

      .header {
        color: white;
        padding-bottom: 20px;
        text-align: center;
        font-size: 26px;
        font-weight: bold;
      }

      .content {
        padding: 25px;
        color: #338;
        line-height: 1.8;
        font-size: 15px;
      }

      .verification-code {
        display: block;
        margin: 20px 0;
        font-size: 22px;
        color: #4caf50;
        background: #e8f5e9;
        border: 1px dashed #4caf50;
        padding: 10px;
        text-align: center;
        border-radius: 5px;
        font-weight: bold;
        letter-spacing: 2px;
      }

      .footer {
        background-color: #f4f4f4;
        padding: 15px;
        text-align: center;
        color: #777;
        font-size: 12px;
        border-top: 1px solid #ddd;
      }

      p {
        margin: 0 0 15px;
        text-align: justify;
      }

      .logo-box {
        height: 3rem;
        padding: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }

      .logo-box img {
        width: 50px;
        height: 50px;
        display: block;
      }

      .logo-text {
        font-size: 2.5rem;
        text-align: center;
        font-weight: bold;
        background: linear-gradient(to right, #2ec217, #3ebc96);
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .bg-same {
        background: linear-gradient(90deg, #049110 0%, #4caf50 100%);
      }

      @media only screen and (max-width: 500px) {
        .container {
          width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }

        .logo-box {
          padding: 0.7rem !important;
        }

        .logo-box img {
          width: 40px !important;
          height: 40px !important;
        }

        .logo-text {
          font-size: 2rem !important;
        }

        .header {
          font-size: 20px !important;
          padding-bottom: 15px !important;
        }

        .content {
          padding: 18px !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }

        .verification-code {
          font-size: 18px !important;
          padding: 8px !important;
          letter-spacing: 1px !important;
          margin: 15px 0 !important;
        }

        p {
          font-size: 14px !important;
        }

        .footer {
          font-size: 11px !important;
          padding: 12px !important;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="bg-same">
        <div class="logo-box">
          <img
            src="https://video-chat-app-streamify.onrender.com/logo-streamify.png"
          />
          <h1 class="logo-text">Streamify</h1>
        </div>
        <div class="header">Verify Your Email</div>
      </div>

      <div class="content">
        <p>
          Welcome to <strong>Streamify</strong> — where you can connect with
          learners from around the world, make new friends, and practice
          languages through chatting and video calls.
        </p>

        <p>
          Thank you for signing up! Please confirm your email address by
          entering the code below:
        </p>

        <span class="verification-code">{verificationCode}</span>

        <p>
          If you did not create an account, no further action is required. If
          you have any questions, feel free to contact our support team.
        </p>
      </div>

      <div class="footer">
        <p>
          &copy; ${new Date().getFullYear()} Streamify. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>

`;

export const Welcome_Email_Template = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Streamify</title>

    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f3f6fb;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        border: 1px solid #e2e8f0;
      }
      .header {
        color: white;
        padding-bottom: 25px;
        text-align: center;
        font-size: 28px;
        font-weight: 700;
      }
      .content {
        padding: 30px;
        line-height: 1.7;
      }
      .welcome-message {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 15px;
      }
      .button {
        display: inline-block;
        padding: 12px 25px;
        margin: 25px 0;
        background-color: #2575fc;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
      }
      .footer {
        background-color: #f9fafb;
        padding: 15px;
        text-align: center;
        color: #777;
        font-size: 12px;
        border-top: 1px solid #e2e8f0;
      }
      ul {
        padding-left: 20px;
        margin: 10px 0 20px 0;
      }
      li {
        margin-bottom: 8px;
        text-align: justify;
      }
      p {
        text-align: justify;
      }
      .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .logo-box {
        height: 3rem;
        padding: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      .logo-box img {
        width: 50px;
        height: 50px;
        display: block;
      }

      .logo-text {
        font-size: 2.5rem;
        text-align: center;
        font-weight: bold;
        background: linear-gradient(to right, #2ec217, #3ebc96);
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .bg-same {
        background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
      }

      
      @media only screen and (max-width: 500px) {
        .container {
          width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
        .header {
          font-size: 22px !important;
          padding: 18px !important;
        }
        .content {
          padding: 18px !important;
        }
        .welcome-message {
          font-size: 18px !important;
        }
        p,
        li {
          font-size: 15px !important;
          line-height: 1.5 !important;
        }
        .button {
          font-size: 14px !important;
          padding: 10px 20px !important;
        }
        .footer {
          font-size: 10px !important;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="bg-same">
        <div class="logo-box">
          <img
            src="https://video-chat-app-streamify.onrender.com/logo-streamify.png"
          />
          <h1 class="logo-text">Streamify</h1>
        </div>
        <div class="header">Welcome to Streamify</div>
      </div>

      <div class="content">
        <p class="welcome-message">Hey {name},</p>

        <p>
          Welcome to <strong>Streamify</strong> — the place where learners
          connect, share ideas, and grow together.
        </p>

        <p>
          You’re now part of a vibrant community that loves learning, chatting,
          and collaborating in real time!
        </p>

        <p>Here’s what you can do next:</p>

        <ul>
          <li>
            💬 <strong>Start chatting</strong> with learners who share your
            interests.
          </li>
          <li>
            🎥 <strong>Join live video calls</strong> to discuss ideas or study
            together.
          </li>
          <li>
            🚀 <strong>Explore new communities</strong> and find your perfect
            learning circle.
          </li>
        </ul>

        <span class="flex-center">
          <a
            href="https://video-chat-app-streamify.onrender.com/"
            class="button"
          >
            Start Exploring Streamify
          </a>
        </span>

        <p>
          If you ever need help or have any questions, our support team is just
          a message away. Let’s make learning fun together!
        </p>
      </div>

      <div class="footer">
        <p>
          &copy; ${new Date().getFullYear()} Streamify. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>

`;

export const Reset_Password_Email_Template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>

    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: #eef1f7;
      }

      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        border: 1px solid #e0e0e0;
      }

      .header {
        color: white;
        padding-bottom: 20px;
        text-align: center;
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 0.5px;
      }

      .content {
        padding: 28px;
        color: #333;
        line-height: 1.8;
        font-size: 15px;
      }

      .reset-code {
        display: block;
        margin: 25px 0;
        font-size: 26px;
        color: #5b2cff;
        background: #f3edff;
        border: 1px solid #cfc2ff;
        padding: 14px;
        text-align: center;
        border-radius: 8px;
        font-weight: bold;
        letter-spacing: 3px;
      }

      .footer {
        background-color: #fafafa;
        padding: 18px;
        text-align: center;
        color: #777;
        font-size: 13px;
        border-top: 1px solid #ddd;
      }

      p {
        margin: 0 0 15px;
        text-align: justify;
      }

      .logo-box {
        height: 3rem;
        padding: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }

      .logo-box img {
        width: 50px;
        height: 50px;
        display: block;
      }

      .logo-text {
        font-size: 2.5rem;
        text-align: center;
        font-weight: bold;
        background: linear-gradient(to right, #2ec217, #3ebc96);
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .bg-same {
        background: linear-gradient(135deg, #5b8dfd, #7b5cff);
      }

      @media only screen and (max-width: 500px) {
        .container {
          width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
        .content {
          padding: 20px !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        .header {
          font-size: 20px !important;
          padding-bottom: 15px !important;
        }
        .logo-box {
          padding: 0.7rem !important;
        }
        .logo-box img {
          width: 40px !important;
          height: 40px !important;
        }
        .logo-text {
          font-size: 1.8rem !important;
        }
        .reset-code {
          font-size: 20px !important;
          padding: 12px !important;
          letter-spacing: 2px !important;
        }
        p {
          font-size: 14px !important;
        }
        .footer {
          font-size: 11px !important;
          padding: 14px !important;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="bg-same">
        <div class="logo-box">
          <img
            src="https://video-chat-app-streamify.onrender.com/logo-streamify.png"
          />
          <h1 class="logo-text">Streamify</h1>
        </div>
        <div class="header">Reset Your Password</div>
      </div>

      <div class="content">
        <p>Hello, {name}</p>

        <p>
          We received a request to reset your password for your
          <strong>Streamify</strong> account.
        </p>

        <p>
          Please use the following code to reset your password. Enter this code
          on the password reset page:
        </p>

        <span class="reset-code">{resetCode}</span>

        <p>
          If you didn’t request this action, please ignore this email. Your
          account will remain secure.
        </p>

        <p>
          <strong>Note:</strong> This code expires in
          <strong>60 seconds</strong> for security reasons.
        </p>

        <p>
          For your safety, never share this code with anyone. Streamify support
          will never ask for your OTP or password.
        </p>

        <p>
          If you continue to face issues or did not initiate this request,
          please contact our support team immediately so we can help secure your
          account.
        </p>

        <p>Thank you for helping us keep your account safe and secure.</p>
      </div>

      <div class="footer">
        <p> &copy; ${new Date().getFullYear()} Streamify. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>

`;
