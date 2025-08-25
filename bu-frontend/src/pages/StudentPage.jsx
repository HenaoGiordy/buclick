import React from 'react';
import TopNavbar from '../components/TopNavbar';
import MainStudentView from './student/MainStudentView';
import LogoutButton from '../components/auth/LogoutButton';



const StudentPage = () => (
  <>
    <TopNavbar/>
    <MainStudentView/>
    <LogoutButton/>
  </>
);

export default StudentPage;