import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import BokkingRow from "./BokkingRow";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
    const { user } = useContext(AuthContext)
    const [bookings, setBookings] = useState([])
    const navigate = useNavigate();


    const url = `https://car-doctor-server-beta-olive.vercel.app/bookings?email=${user?.email}`

    useEffect(() => {
        fetch(url, {
            method:'GET',
            headers:{
                authorization: `Bearer ${localStorage.getItem('car-access-token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if(!data.error){
                setBookings(data)}
                else{
                    navigate('/');

                }
            })
    }, [url,navigate]);

    const handleDelete = id =>{
        const proceed = confirm('Are you sure you want to delete');

        if(proceed){
            fetch(`https://car-doctor-server-beta-olive.vercel.app/bookings/${id}`,{
                method: "DELETE"

            })
            .then(res => res.json())
            .then(data => {console.log(data)
                if(data.deletedCount > 0){
                    alert('deleted successful');
                    const remaining = bookings.filter(booking => booking._id !== id)
                    setBookings(remaining)
                }
            })

        }
    }

    const handleBookingConfirm = id =>{
        fetch(`https://car-doctor-server-beta-olive.vercel.app/bookings/${id}`,{
            method:'PATCH',
            headers:{
                'content-type' : 'application/json'
            },
            body: JSON.stringify({status:'confirm'})
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.modifiedCount > 0){
                //updateState
                const remaining = bookings.filter(booking => booking._id !== id);
                const updated = bookings.find(bookings._id === id);
                updated.status='confirm'
                const newBookings =[updated, ...remaining];
                setBookings(newBookings);
            }
        })
    }
    return (
        <div>
            <h2 className="text-5xl font-bold">YOUR BOOKINGS : {bookings.length}</h2>
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Image</th>
                            <th>service</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookings.map(booking => <BokkingRow
                            key={booking._id}
                            booking={booking}
                            handleDelete={handleDelete}
                            handleBookingConfirm={handleBookingConfirm}
                            ></BokkingRow>)
                        }
                    </tbody>
                   
                

                </table>
            </div>
        </div>
    );
};

export default Bookings;