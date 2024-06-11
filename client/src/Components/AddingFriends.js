
// This component will send a friend request to a user.
import React from 'react';
import axios from 'axios';

function FriendRequestButton({ recipientId }) {
    const sendFriendRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/api/friendships', { recipientId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Friend request sent!');
        } catch (error) {
            alert('Failed to send friend request: ' + error.response.data.message);
        }
    };

    return <button onClick={sendFriendRequest}>Add Friend</button>;
}



// This component will be used to accept or decline friend requests.
export default FriendRequestButton;
import React from 'react';
import axios from 'axios';



function FriendResponseButton({ friendshipId, action }) {
    const handleResponse = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:3001/api/friendships/${friendshipId}/${action}`;
            await axios.patch(url, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Friend request ${action}ed!`);
        } catch (error) {
            alert(`Failed to ${action} friend request: ` + error.response.data.message);
        }
    };

    return (
        <button onClick={handleResponse}>
            {action.charAt(0).toUpperCase() + action.slice(1)}
        </button>
    );
}

export default FriendResponseButton;

// Usage in Profiles or Suggestions List
// Assuming you have a list of users or friend requests, you can include these buttons accordingly.

function UserProfile({ user }) {
    return (
        <div>
            <h1>{user.firstName} {user.lastName}</h1>
            
            <FriendRequestButton recipientId={user._id} />
        </div>
    );
}

function FriendRequest({ request }) {
    return (
        <div>
            <p>{request.requesterName} wants to be your friend!</p>
            <FriendResponseButton friendshipId={request._id} action="accept" />
            <FriendResponseButton friendshipId={request._id} action="decline" />
        </div>
    );
}
