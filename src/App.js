import { Provider } from 'react-redux';
import createStore from './store/index';
import './App.css';
import { RouterProvider, createBrowserRouter, createHashRouter, useLocation } from 'react-router-dom';
import ControlPanel from './pages/dashboard/ControlPanel';
import ExamModule from './pages/exam/container/ExamModule';
import VoucherModule from './pages/voucher/container/VoucherModule';
import FeedbackDashboard from './pages/feedback/container/FeedbackDashboard';
import FeedbackForm from './pages/feedback/container/FeedbackForm';
import UserTable from './pages/user/container/UserTable';
import EmployeeModule from './pages/Staff/container/EmployeeModule';
import QuestionModule from './pages/question/container/QuestionModule';
import ForgetPassword from './pages/login/container/ForgetPassword';
import PrivateRoute from './component/common/PrivateRoute';
import VoucherValidation from './pages/voucher/container/VoucherValidation';
import Instructions from './pages/exam/container/Instructions';
import SubmitExam from './pages/exam/container/SubmitExam';
import StartExam from './pages/exam/container/StartExam';
import StudentLogin from './pages/login/container/StudentLogin';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ResultModule from './pages/result/container/ResultModule';
import PageNotFound from './pages/ErrorPage/PageNotFound';
// import TrainerFeedbackTable from './pages/trainerFeedback/container/TrainerFeedbackTable';
import RegistrationForm from './pages/user/container/RegistrationForm';
import EmployeeRegistration from './pages/user/container/EmployeeRegistration';
// import ScheduleFeedback from './pages/trainerFeedback/container/ScheduleFeedback';
import ShowAnswer from './pages/exam/container/ShowAnswer';
import BatchModule from './pages/batch/container/BatchModule';
import AddBatch from './pages/batch/container/AddBatch';
import EnrollmentModule from './pages/enrollment/container/EnrollmentModule';
import EnquiryModule from './pages/enquiry/container/EnquiryModule';
import { useEffect } from 'react';

const store = createStore();

function App() {
//convert https protocol to http
  useEffect(() => {
    if (window.location.protocol === "https:") {
      const httpURL = window.location.href.replace("https://", "http://");
      window.location.replace(httpURL);
    }
  }, []);

  const colortheme = createTheme({
    palette: {
      primary: {
        main: '#2c387e',
      },
      secondary: {
        main: '#f44336',
      },
    },
  });
  const router = createHashRouter([
    { path: '', element: <StudentLogin /> },
    { path: '/quizapp', element: <PrivateRoute> <VoucherValidation /></PrivateRoute> },
    { path: '/instruction', element: <PrivateRoute><Instructions /></PrivateRoute> },
    { path: '/start-exam', element: <PrivateRoute><StartExam /></PrivateRoute> },
    { path: '/exam-submitted', element: <SubmitExam /> },
    { path: '/student-registration', element: <RegistrationForm /> },
    { path: '/employee-registration', element: <EmployeeRegistration /> },
    { path: '/student-feedback', element: <FeedbackForm /> },
    { path: '/forgetpassword', element: <ForgetPassword /> },
    { path: '/question-answer', element: <ShowAnswerWrapper /> },
    { path: '*', element: <PageNotFound /> },
    {
      path: '/dashboard', element: <PrivateRoute><ControlPanel /></PrivateRoute>,
      children: [
        {
          path: "exam",
          element: <PrivateRoute><ExamModule /></PrivateRoute>,
        },
        {
          path: "voucher",
          element: <PrivateRoute><VoucherModule /></PrivateRoute>,
        },

        {
          path: "feedback",
          element: <PrivateRoute><FeedbackDashboard /></PrivateRoute>,
        },
        {
          path: "student",
          element: <PrivateRoute><UserTable /></PrivateRoute>,
        },
        {
          path: "question",
          element: <PrivateRoute><QuestionModule /></PrivateRoute>,
        },
        {
          path: "staff",
          element: <PrivateRoute><EmployeeModule /></PrivateRoute>,
        },
        {
          path: "result",
          element: <PrivateRoute><ResultModule /></PrivateRoute>
        },
        // {
        //   path: "trainer-feedback",
        //   element: <PrivateRoute><TrainerFeedbackTable /></PrivateRoute>
        // },
        // {
        //   path: "schedule",
        //   element: <PrivateRoute><ScheduleFeedback /></PrivateRoute>
        // },
        {
          path: "manage-batch",
          element: <PrivateRoute><AddBatch /></PrivateRoute>,
        },
        {
          path: "batch",
          element: <PrivateRoute><BatchModule /></PrivateRoute>,
        },
        {
          path: "register-student",
          element: <PrivateRoute><EnrollmentModule /></PrivateRoute>,
        },
        {
          path: "enquiry",
          element: <PrivateRoute><EnquiryModule /></PrivateRoute>,
        },
      ],
    },

  ])

  return (
    <Provider store={store} >
      <ThemeProvider theme={colortheme}>
        <div className="App" data-testid="AppWrapper">
          <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    </Provider>

  );

}
const ShowAnswerWrapper = () => {
  const location = useLocation();
  const req = location.state?.req; // Access the req object
  return <ShowAnswer req={req} />;
};

export default App;
