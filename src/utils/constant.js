import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
export const urls = {
  token: '/api/token/',
  exams: '/api/exam/',
  question: '/api/question/',
  voucher: '/api/voucher/',
  feedback: '/api/feedback/',
  student: '/api/user/student-register/',
  branch: '/api/branch/',
  staff: '/api/user/employee-register/',
  user: '/api/user/',
  employee: '/api/employee/',
  password: '/api/user/forget-passwords/',
  result: '/api/result/results/',
  submit_exam: '/api/result/submitexam/',
  start_exam: '/api/question/examquestions',
  upload_csv: '/api/upload-csv/',
  feedbackAns:'/api/feedback-answer/',
  batch:'/api/batch/',
  batchWiseStudent:'/api/batch-wise-students/',
  scheduled:'/api/schedule/',
  sendEmail:'/api/send-email/',
  course:'/api/course/',
  enquiry:'/api/enquiry/',
  enroll:'/api/enroll/'
};

//-------------------------Validation Regx----------------------//
export const isValidFullName = (name) => /^[a-zA-Z ]{2,40}$/.test(name);
export const isValidQue = (que) => /^[a-zA-Z0-9., ]{5,500}$/.test(que);
export const isValidName = (name) => /^[a-zA-Z]{2,20}$/.test(name);
export const isValidContact = (contact) => /^[6789]\d{9}$/.test(contact);
export const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|orkut|rediff|corp|foundation|outlook|hotmail|live|hematitecorp)\.(com|org|in|corp|govt|net)$/mg.test(email);
export const isValidPnr = (pnr) => /^[0-9]{16,20}$/.test(pnr);
export const isValidPassword = (Password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,14}$/.test(Password);
export const isValidExamName = (name) => /^[a-zA-Z0-9\- ]{2,30}$/.test(name);
export const isValidExamTime = (time) =>/^[a-zA-Z0-9]{1,3}min$/.test(time);
export const isValidQuestionCount = (count) =>  /^[0-9]{1,3}$/.test(count);
export const isValidexamcode = (examcode) => /^[a-zA-Z0-9]+[a-zA-Z0-9\- ]{1,9}$/.test(examcode);
export const isValidQuestion = (question) => /^[1-5]{1}$/.test(question);
export const isValidMark = (mark) => /^[0-9]{1,2}$/.test(mark)
export const isValidOtherBranch = (other) => /^[A-Za-z]{2,30}$/.test(other);
export const isValidVoucher = (voucher) => /^[A-Z0-9]{6}$/.test(voucher);
export const isValidFeedbackAns = (ans) =>/^[a-zA-Z]{2,500}$/.test(ans);
export const isValidEmpId = (emp) => /^[0-9]{3}$/.test(emp);



export const errorText = (message) => {
  return (<span style={{ 'display': 'flex', 'alignItems': 'center' }}>
    <ErrorOutlineIcon /> <span style={{ 'paddingLeft': '5px' }}>{message}</span>
  </span>)
}

