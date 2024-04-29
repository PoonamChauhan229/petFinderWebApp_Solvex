import React from 'react'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from '../utilis/firebase';
import { addUser, removeUser } from '../utilis/userSlice';
import { Link, useLocation } from "react-router-dom"
import Hero from './Hero'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Header = () => { 
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((store) => store.user);
  console.log(user)
  
  const location = useLocation();
  const excludedPaths = ['/login', '/register','/browse','/allbreed']; // Paths where NavBar should be excluded

  // Check if current path is in the excludedPaths array
  const shouldRenderNavBar = !excludedPaths.includes(location.pathname);

    const dispatch = useDispatch();
  const navigate = useNavigate();
  
    const handleSignOut = () => {
        signOut(auth)
          .then(() => {
            toast.error("Logged Out Successfully !", {
              position: "top-right"
            });
          })
          .catch((error) => {
            navigate("/error");
          });
      };
    
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
          if (user !==null) {
            const { uid, email, displayName, photoURL } = user;
            //const response=await axios.get(`https://6624dd2604457d4aaf9d281d.mockapi.io/usersdata?uid=${uid}`);
            //console.log(response.data)
            // dispatch(addUser(response.data))

            dispatch(
              addUser({
                uid: uid,
                email: email,
                displayName: displayName,
                photoURL: photoURL,
              })
            );
           
            navigate("/browse");
          } else {
            dispatch(removeUser());
            navigate("/");
          }
        });
    
        // Unsubscribe when component unmounts
        return () => unsubscribe();
      }, []);

     
      
  return (
    <>
    
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-sm py-3 py-lg-0 px-3 px-lg-0 fixed-top">
          <>
         <div className="navbar-brand ms-lg-5 p-0">
            <h1 className="m-0 text-uppercase text-dark fs-4"><i className="bi bi-shop fs-2 text-primary me-2"></i><b>PET SHOP</b></h1>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0 me-3">
                <Link to="/" className="nav-item nav-link active">Home</Link>
                <Link to="/about" className="nav-item nav-link">About</Link>                
                <Link to="/services" className="nav-item nav-link">Services</Link>
                <ToastContainer />
                {
                  user ?                  
                  <>
                  <div className='d-flex'>
                  <div className="nav-item nav-link" onClick={()=>navigate('/allbreeds')}>AllBreeds</div>
                  <div className="nav-item nav-link">{user?.displayName?.split(" ")[0]}</div>
                  <div onClick={handleSignOut} className='nav-item nav-link'><h5 className="bi bi-power text-danger"></h5></div>
                  </div>
                  </>
                
                                       :            
                  <>
                  <Link to="/login" className="nav-item nav-link">Login</Link>
                  <Link to="/register" className="nav-item nav-link">SignUp</Link>
                  </>
                }
            </div>
        </div>
        </>
        
    </nav> 
    {shouldRenderNavBar && <Hero/>}
 
    
    </>
   
  )
}

export default Header