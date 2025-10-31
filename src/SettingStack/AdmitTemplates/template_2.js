export const Template_2 = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exam Admit Card</title>
    <style>
      .admit-card {
        max-width: 850px;
        background: #ffffff;
        margin: auto;
        border: 2px solid #2d3436;
        border-radius: 10px;
        padding: 25px 35px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
      }

      // header {
      //   display: flex;
      //   align-items: center;
      //   border-bottom: 3px solid #2d3436;
      //   padding-bottom: 10px;
      //   margin-bottom: 20px;
      // }

      header img {
        width: 80px;
        height: 80px;
        object-fit: contain;
        margin-right: 20px;
      }

      header h1 {
        margin: 0;
        font-size: 1.6rem;
        color: #2d3436;
      }

      header h3 {
        margin: 4px 0 0;
        font-weight: 500;
        color: #636e72;
      }

      .student-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
      }

      .student-photo {
        width: 120px;
        height: 140px;
        object-fit: cover;
        border: 2px solid #2d3436;
        border-radius: 5px;
      }

      .info-table {
        width: 100%;
        border-collapse: collapse;
        margin-left: 20px;
      }

      .info-table th {
        text-align: left;
        width: 40%;
        padding: 6px 0;
        color: #2d3436;
        font-weight: 600;
      }

      .info-table td {
        padding: 6px 0;
        color: #2f3640;
      }

      .exam-details {
        margin-bottom: 25px;
      }

      .exam-details h3 {
        color: #2d3436;
        margin-bottom: 10px;
      }

      .exam-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
      }

      .exam-table th,
      .exam-table td {
        border: 1px solid #b2bec3;
        padding: 10px;
        text-align: center;
      }

      .exam-table th {
        background: #dfe6e9;
        color: #2d3436;
      }

      .exam-table td {
        color: #2f3640;
      }

      .footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-top: 3px solid #2d3436;
        padding-top: 10px;
      }

      .signature {
        width: 35%;
        text-align: center;
      }

      .signature p {
        margin-bottom: 40px;
        font-weight: 500;
      }

      .sign-line {
        border-bottom: 1px solid #2d3436;
        width: 80%;
        margin: 0 auto;
      }

      .instructions {
        width: 60%;
      }

      .instructions h4 {
        margin-bottom: 6px;
        color: #2d3436;
      }

      .instructions ul {
        margin: 0;
        padding-left: 18px;
      }

      .instructions li {
        font-size: 0.9rem;
        color: #2f3640;
        line-height: 1.5;
      }

      @media print {
        body {
          background: #fff;
          padding: 0;
        }
        .admit-card {
          border: none;
          box-shadow: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="admit-card">
      <header>
        <img src="logo.png" alt="Institution Logo" />
        <div>
          <h1>Global University of Science</h1>
          <h3>Examination Admit Card - 2025</h3>
        </div>
      </header>

      <section class="student-info">
        <div>
          <table class="info-table">
            <tr><th>Student Name:</th><td>John Doe</td></tr>
            <tr><th>Roll No:</th><td>GUS2025-0987</td></tr>
            <tr><th>Registration No:</th><td>REG-56743</td></tr>
            <tr><th>Course:</th><td>Bachelor of Science (CS)</td></tr>
            <tr><th>Exam Centre:</th><td>City Hall, New Delhi</td></tr>
            <tr><th>Exam Date:</th><td>15 November 2025</td></tr>
          </table>
        </div>
        <div>
          <img src="student-photo.jpg" alt="Student Photo" class="student-photo" />
        </div>
      </section>

      <section class="exam-details">
        <h3>Exam Schedule</h3>
        <table class="exam-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Code</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mathematics</td>
              <td>MTH101</td>
              <td>15-Nov-2025</td>
              <td>09:00 AM - 12:00 PM</td>
            </tr>
            <tr>
              <td>Physics</td>
              <td>PHY102</td>
              <td>17-Nov-2025</td>
              <td>09:00 AM - 12:00 PM</td>
            </tr>
            <tr>
              <td>Computer Science</td>
              <td>CSC103</td>
              <td>19-Nov-2025</td>
              <td>09:00 AM - 12:00 PM</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </body>
</html>
`