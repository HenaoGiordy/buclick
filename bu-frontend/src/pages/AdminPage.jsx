import {
    Route,
    Routes
} from 'react-router-dom'
import ManagementUsers from './admin/ManagementUsers.jsx';
import HeaderAdmin from '../components/admin/HeaderAdmin.jsx';

export default function AdminPage (){
    return(
        <>
            <Routes>
                <Route path="/gestionUsuarios" element={ <ManagementUsers/> } />
            </Routes>

            <HeaderAdmin/>
            {/* <ManagementUsers/> */}
        </>
            
    );
}