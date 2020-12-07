var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'svsudowindo@gmail.com',
        pass: '8125431943'
    }
});

var mailOptions = {
    from: 'svsudowindo@gmail.com',
    to: '',
    subject: '',
    text: ''
};

// to connect to any email and allow them to send mail Less secure app access should be in ON state we can do by following link
// https://myaccount.google.com/lesssecureapps?pli=1 

module.exports = function (req, res, toEmail, subject, message) {
    mailOptions['to'] = toEmail;
    mailOptions['subject'] = subject;
    mailOptions['text'] = FormatCompanyDetails(message);
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        } else {
            res.status(200).send(JSON.stringify({ status: 200, errors: [], data: null, message: 'Request Sent Successfully' }));
            return info.response
        }
    });
}

function FormatCompanyDetails(message) {
    const companyDetails = message.companyDetails;
    const employeeDetails = message.adminDetails;
    const formattedCompanyDetails = 'Company Details: \n Company Name: ' + companyDetails.companyName + '\n Company Email: ' + companyDetails.companyEmail + '\n Company Website' + companyDetails.companyWebsiteLink + '\n Company Mobile Number : ' + companyDetails.companyMobileNumber + '\n Company GST IN: ' + companyDetails.companyGSTIN;
    const formattedEmployeeDetails = 'Employee Details: \n First Name: ' + employeeDetails.firstName + '\n Middle Name' + employeeDetails.middleName + '\n Last Name: ' + employeeDetails.lastName + '\n Employee Mobile Number: ' + employeeDetails.mobile +  '\n Email: ' + employeeDetails.email + '\n Employee ID: ' + employeeDetails.employeeID  + '\n Employee status: ' + (employeeDetails.isActiveUser ? 'Active' : 'Inactive') + '\n Approval Manager Id: ' + employeeDetails.approvalManagerId + '\n Approval Manager Name: ' + employeeDetails.approvalManagerName + '\n Department Name: ' + employeeDetails.departmentName + '\n Department ID: ' + employeeDetails.departmentId;
    return formattedCompanyDetails + '\n\n' + formattedEmployeeDetails;
}