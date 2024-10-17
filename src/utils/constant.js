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
export const isValidQue = (que) => /^[a-zA-Z0-9., ]{5,100}$/.test(que);
export const isValidName = (name) => /^[a-zA-Z]{2,10}$/.test(name);
export const isValidContact = (contact) => /^[6789]\d{9}$/.test(contact);
export const isValidEmail = (email) => /^[a-z0-9.]+@gmail\.com$/mg.test(email);
export const isValidPnr = (pnr) => /^[A-Za-z0-9-]+$/.test(pnr);
export const isValidPassword = (Password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(Password);
export const isValidexamname = (name) => /^[a-zA-Z]{2,10}$/.test(name);
export const isValidexamcode = (examcode) => /^[a-zA-Z0-9]+[a-zA-Z0-9\- ]{1,9}$/.test(examcode);
export const isValidQuestion = (question) => /^[1-5]{1}$/.test(question);
export const isValidMark = (mark) => /^[0-9]+$/.test(mark)

export const errorText = (message) => {
  return (<span style={{ 'display': 'flex', 'alignItems': 'center' }}>
    <ErrorOutlineIcon /> <span style={{ 'paddingLeft': '5px' }}>{message}</span>
  </span>)
}

