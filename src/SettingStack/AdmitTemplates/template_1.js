export const Template_1 =
`<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Exam Admin Card</title>
    <style>
        // body {
        //     font-family: 'Poppins', sans-serif;
        //     background: #f4f7fa;
        //     display: flex;
        //     align-items: center;
        //     justify-content: center;
        //     height: 100vh;
        //     margin: 0;
        // }

        .card {
            width: 420px;
            height: 260px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            padding: 20px 24px;
            box-sizing: border-box;
            position: relative;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 8px;
        }

        .logo {
            font-size: 20px;
            font-weight: 700;
            color: #0056b3;
        }

        .university-name {
            font-size: 14px;
            color: #444;
        }

        .card-body {
            margin-top: 18px;
        }

        .photo {
            width: 80px;
            height: 100px;
            border-radius: 6px;
            background: #e0e6ef;
            float: right;
            object-fit: cover;
        }

        .info {
            line-height: 1.8;
            font-size: 14px;
            color: #222;
        }

        .label {
            font-weight: 600;
            color: #555;
        }

        .card-footer {
            position: absolute;
            bottom: 12px;
            left: 24px;
            right: 24px;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 6px;
        }

        @media print {
            body {
                background: white;
            }

            .card {
                box-shadow: none;
                margin: 0 auto;
            }
        }
    </style>
</head>

<body>
    <div class="card">
        <div class="card-header">
            <div>
                <div class="logo">EXAM ADMIN CARD</div>
                <div class="university-name">University of Excellence</div>
            </div>
            <div><img src="https://via.placeholder.com/80x80?text=Logo" alt="Logo" style="border-radius:50%;"></div>
        </div>

        <div class="card-body">
            <img src="https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_1280.png" alt="Admin Photo" class="photo" />
            <div class="info">
                <div><span class="label">Name:</span> Dr. Aarti Sharma</div>
                <div><span class="label">Position:</span> Exam Controller</div>
                <div><span class="label">Exam Session:</span> 2025 Annual Examination</div>
                <div><span class="label">ID No.:</span> EX-ADM-2025-001</div>
                <div><span class="label">Valid Till:</span> 31 Dec 2025</div>
            </div>
        </div>

        <div class="card-footer">
            <div>Issued by: Examination Department</div>
            <div>Signature</div>
        </div>
    </div>
</body>

</html>`