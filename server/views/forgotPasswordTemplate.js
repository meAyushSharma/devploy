module.exports.forgotPasswordTemplate = code => `

<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Forgot Password Request</title>
    <meta name="description" content="Verify registration email." />
    <style type="text/css">
        @import url("https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap");
        a:hover {
            text-decoration: underline !important;
        }
    </style>
</head>
<body style="margin: 0px; background-color: #f2f3f8;">
    <!-- 100% body table -->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" 
           style="font-family: 'Satoshi', sans-serif, Arial, Helvetica;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height: 80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;"></td>
                    </tr>
                    <tr>
                        <td style="height: 20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" 
                                   style="max-width: 670px; background: #fff; border-radius: 5px; text-align: center;
                                          -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, .06);
                                          -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, .06);
                                          box-shadow: 0 6px 18px 0 rgba(0, 0, 0, .06); padding: 20px;">
                                <tr>
                                    <td style="height: 40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 35px;">
                                        <h1 style="color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px; font-family: 'Satoshi', sans-serif;">
                                            You have requested at devploynest.in for resetting password
                                        </h1>
                                        <span style="display: inline-block; vertical-align: middle; margin: 29px 0 26px; 
                                                     border-bottom: 1px solid #cecece; width: 100px;">
                                        </span>
                                        <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0;">
                                            A unique code to reset your password has been generated for you. 
                                            To verify your email, paste the following code in forgot password window and follow the instructions.
                                        </p>
                                        <div
                                           style="background: rgba(91, 33, 182, .9); font-weight: 600; 
                                                  margin-top: 24px; color: #fff; text-transform: uppercase; font-size: 16px; 
                                                  padding: 12px 30px; display: inline-block; border-radius: 50px;
                                                  letter-spacing: 1px;">
                                            Verification code: <strong>${code}</strong>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height: 40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 35px;">Code valid for 10 minutes only</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="height: 20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="height: 80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!-- /100% body table -->
</body>
</html>

`