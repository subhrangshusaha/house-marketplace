import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { /*useEffect,*/ useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { db } from "../firebase.config";
import { toast } from 'react-toastify';
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile() {
	const auth = getAuth();
	const [ changeDetails, setChangeDetails ] = useState(false);
	const [ formData, setFormData ] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	});
	const { name, email } = formData;

	const navigate = useNavigate();

	const onLogout = () => {
		auth.signOut();
		navigate('/sign-in');
	};

	const onSubmit = async () => {
		try {
			// Changing the Name
			if(auth.currentUser.displayName !== name) {
				// Update displayName in firebase
				await updateProfile(auth.currentUser, {
					displayName: name
				});

				// Update in FireStore db
				const userRef = doc(db, 'users', auth.currentUser.uid);
				await updateDoc(userRef, { name });
			}
		} catch (error) {
			toast.error('Something went wrong! Could not update profile details.');
		}
	};

	const onChange = e => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	}
	
	return (
		<div className="profile">
			<header className="profileHeader">
				<p className="pageHeader">My Profile</p>
				<button type="button" className="logOut" onClick={onLogout}>Logout</button>
			</header>

			<main>
				<div className="profileDetailsHeader">
					<p className="profileDetailsText">Personal Details</p>
					<p
						className="changePersonalDetails"
						onClick={() => {
							changeDetails && onSubmit();
							setChangeDetails(!changeDetails);
						}}
					>
						{changeDetails ? 'done' : 'change'}
					</p>
				</div>

				<div className="profileCard">
					<form action="">
						<input
							type="text"
							id="name"
							className={changeDetails ? 'profileNameActive' : 'profileName' } disabled={!changeDetails}
							value={name}
							onChange={onChange}
						/>
						<input
							type="text"
							id="email"
							className='profileEmail'
							disabled={true}
							value={email}
							onChange={onChange}
						/>
					</form>
				</div>

				<Link to='create-listing' className='createListing'>
					<img src={homeIcon} alt="Home" />
					<p>Sell or Rent your Home</p>
					<img src={arrowRight} alt="arrow right" />
				</Link>
			</main>
		</div>
	)
}

export default Profile;