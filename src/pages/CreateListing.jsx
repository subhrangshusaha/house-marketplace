import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Spinner from "../components/Spinner";

function CreateListing() {
	const [geolocationEnabled, setGeolocationEnabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		type: 'rent',
		name: '',
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: '',
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		longitude: 0,
	});

	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData;

	const auth = getAuth();
	const navigate = useNavigate();
	const isMounted = useRef(true);

	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, user => {
				if (user) {
					setFormData({
						...formData,
						userRef: user.uid
					});
				} else {
					navigate('/sign-in')
				}
			})
		}

		return () => {
			isMounted.current = false;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted]);

	if (loading) {
		return <Spinner />
	}

	const onSubmit = async e => {
		e.preventDefault();
		
		setLoading(true);
		
		if (discountedPrice >= regularPrice) {
			setLoading(false);
			toast.error('Discounted Price should be less than Regular Price');
			return;
		}

		if (images.length > 6) {
			setLoading(false);
			toast.error('A maximum of 6 images can be uploaded. Please remove some.');
			return;
		}

		let geolocation = {};
		let location;

		if (geolocationEnabled) {
			const key='';
			const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`);

			const data = response.json();

			geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
			geolocation.long = data.results[0]?.geometry.location.long ?? 0;

			location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address;

			if(location === undefined || location.includes('undefined')) {
				setLoading(false);
				toast.error('Please enter a correct address');
			}

		} else {
			geolocation.lat = latitude;
			geolocation.long = longitude;
			location = address;
		}

		setLoading(false);
	}
	
	const onMutate = e => {
		let boolean = null;

		if (e.target.value === 'true'){
			boolean = true;
		} else if (e.target.value === 'false'){
			boolean = false;
		}
		

		if (e.target.files) {
			// Files
			setFormData((prevState) => ({
				...prevState,
				images: e.target.files
			}));
		} else {
			// Text/Boolean/Numbers
			setFormData((prevState) => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value,
			}));
		}

	}
	
	return (
		<div className="profile">
			<header>
				<p className="pageHeader">Create a Listing</p>
			</header>

			<main>
				<form onSubmit={onSubmit}>
					{/* 1. Sell/Rent */}
					<label className="formLabel">Sell/Rent</label>
					<div className="formButtons">
						<button
							type="button"
							className={type === 'sale' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='sale'
							onClick={onMutate}
						>
							Sell
						</button>
						<button
							type="button"
							className={type === 'rent' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='rent'
							onClick={onMutate}
						>
							Rent
						</button>
					</div>

					{/* 2. Name */}
					<label className="formLabel">Name</label>
					<input
						type="text"
						id="name"
						className="formInputName"
						value={name}
						onChange={onMutate}
						maxLength='32'
						minLength='10'
						required
					/>

					{/* 3. Rooms */}
					<div className="formRooms flex">
						<div>
							<label className="formLabel">Bedrooms</label>
							<input
								type="number"
								id="bedrooms"
								className="formInputSmall"
								value={bedrooms}
								onChange={onMutate}
								min='1'
								max='50'
							/>
						</div>
						<div>
							<label className="formLabel">Bathrooms</label>
							<input
								type="number"
								id="bathrooms"
								className="formInputSmall"
								value={bathrooms}
								onChange={onMutate}
								min='1'
								max='50'
							/>
						</div>
					</div>

					{/* 4. Parking */}
					<label className="formLabel">Parking</label>
					<div className="formButtons">
						<button
							type="button"
							id="parking"
							className={parking ? 'formButtonActive' : 'formButton'}
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							type="button"
							id="parking"
							className={!parking && parking !== null ? 'formButtonActive' : 'formButton'}
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>

					{/* 5. Furnished */}
					<label className="formLabel">Furnished</label>
					<div className="formButtons">
						<button
							type="button"
							id="furnished"
							className={furnished ? 'formButtonActive' : 'formButton'}
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							type="button"
							id="furnished"
							className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'}
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>

					{/* 6. Address */}
					<label className="formLabel">Address</label>
					<textarea
						type='text'
						id='address'
						className="formInputAddress"
						value={address}
						onChange={onMutate}
						required
					/>
					{!geolocationEnabled && (
						<div className="formLatLng flex">
							<div>
								<label className="formLabel">Latitude</label>
								<input
									type="number"
									id="latitude"
									className="formInputSmall"
									value={latitude}
									onChange={onMutate}
									required
								/>
							</div>
							<div>
								<label className="formLabel">Longitude</label>
								<input
									type="number"
									id="longitude"
									className="formInputSmall"
									value={longitude}
									onChange={onMutate}
									required
								/>
							</div>
						</div>
					)}
					
					{/* 7. Offer */}
					<label className="formLabel">Offer</label>
					<div className="formButtons">
						<button
							type="button"
							id="offer"
							className={offer ? 'formButtonActive' : 'formButton'}
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							type="button"
							id="offer"
							className={!offer && offer !== null ? 'formButtonActive' : 'formButton'}
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>

					{/* 7. Regular Price */}
					<label className="formLabel">Regular Price</label>
					<div className="formPriceDiv">
						<p className="formPriceUnit">Rs. </p>
						<input
							type="number"
							id="regularPrice"
							className="formInputSmall"
							value={regularPrice}
							onChange={onMutate}
							min='50'
							max='500000000'
							required
						/>
						{type === 'rent' && (
							<p className="formPriceText">/ Month</p>
						)}
					</div>

					{/* 7.2. Discounted Price */}
					{offer && (
						<>
							<label className="formLabel">Discounted Price</label>
							<div className="formPriceDiv">
								<p className="formPriceUnit">Rs. </p>
								<input
									type="number"
									id="discountedPrice"
									className="formInputSmall"
									value={discountedPrice}
									onChange={onMutate}
									min='50'
									max='500000000'
									required
								/>
								{type === 'rent' && (
									<p className="formPriceText">/ Month</p>
								)}
							</div>
						</>
					)}

					{/* 8. Images */}
					<label className="formLabel">Images</label>
					<p className="imagesInfo">The first image will be the cover (max 6).</p>
					<input
							type="file"
							id="images"
							className="formInputFile"
							onChange={onMutate}
							max='6'
							accept="'.jpg,.png,.jpeg"
							multiple
							required
						/>

						<button className="primaryButton createListingButton" type='submit'>
							Create listing
						</button>
				</form>
			</main>
		</div>
	)
}

export default CreateListing;