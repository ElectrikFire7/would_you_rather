import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/home.css'
import {BrowserView, MobileView} from 'react-device-detect';

const CreateQuestion = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const username = location.state?.userData?.username ?? "non-user";
    const user_ID = location.state?.userData?.userId ?? "non-user";

    const [description, setDescription] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cerror, setCerror] = useState('');
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [preview1, setPreview1] = useState(null);
    const [preview2, setPreview2] = useState(null);

    useEffect(() => {
        if (username === "non-user") {
            navigate('/');
        }
    }, [username, navigate]);

    const travelHome = () => {
        navigate('/home', {state: { userData: location.state.userData }});
    }

    //handle image being uploaded in input
    const handleImageChange = (e, inputType) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (inputType === 'input1') {
                setImage1(file);
                setPreview1(previewUrl);
            } else if (inputType === 'input2') {
                setImage2(file);
                setPreview2(previewUrl);
            }
        }
    };

    const createQuestion = async () => {
        setIsLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('description', description);
            formData.append('option1', option1 || '');
            formData.append('option2', option2 || '');
            formData.append('image', image1);
            formData.append('image', image2);
            formData.append('user_id', user_ID);
            formData.append('username', username);
            formData.append('anonymous', anonymous);

            const response = await axios.post('https://would-you-rather-ku9r.onrender.com/createQuestion/', formData);

            console.log('Question created:', response.data);
            // Reset form after successful submission
            setDescription('');
            setOption1('');
            setOption2('');
            setImage1(null);
            setImage2(null);
            setPreview1(null);
            setPreview2(null);
            setAnonymous(false);
            alert('Question created successfully!');
            setIsLoading(false);
            travelHome();
        } catch (error) {
            setCerror(error.message);
            setIsLoading(false);
            alert('Failed to create question');
        }
    };

    return(
        <>
        <BrowserView>
        <div id='maindiv'>
            <div>
                <button className={`tab-button`} onClick={travelHome} >Home</button>
            </div>
            <div>
                <h1 id='cnq'>Create a new question</h1>
                <div>
                    <label id='label'>Question description:</label>
                    <input id='inputdecription' type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Option 1:</label>
                    <input id='input' type='text' value={option1} onChange={(e) => setOption1(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Option 2:</label>
                    <input id='input' type='text' value={option2} onChange={(e) => setOption2(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Upload Image 1:</label>
                    <input
                        id='input'
                        type="file"
                        onChange={(e) => handleImageChange(e, 'input1')}
                    />
                    {preview1 && <img src={preview1} alt='Preview 1' style={{ width: '100px', height: '100px', margin: '10px', marginLeft: '15px' }} />}
                </div>
                <div>
                    <label id='label'>Upload Image 2:</label>
                    <input
                        id='input'
                        type="file"
                        onChange={(e) => handleImageChange(e, 'input2')}
                    />
                    {preview2 && <img src={preview2} alt='Preview 2' style={{ width: '100px', height: '100px', margin: '10px', marginLeft: '15px' }} />}
                </div>
                <div>
                    <label id='label'>Anonymous:</label>
                    <input type='checkbox' value={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                </div>
                <button id='createQuestionButton' onClick={createQuestion}>{isLoading ? 'Loading...' : 'Create Question'}</button>
            </div>
            <p id='error'>{cerror}</p>
        </div>
        </BrowserView>
        <MobileView>
        <div id='maindiv'>
            <div>
                <button className={`tab-button`} onClick={() => travelHome()} >Home</button>
            </div>
            <div>
                <h1 id='cnq'>Create a new question</h1>
                <div>
                    <label id='label'>Question description:</label>
                    <input id='mobileinputdecription' type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Option 1:</label>
                    <input id='input' type='text' value={option1} onChange={(e) => setOption1(e.target.value)} />
                </div>
                <div>
                    <label id='label'>Option 2:</label>
                    <input id='input' type='text' value={option2} onChange={(e) => setOption2(e.target.value)} />
                </div>
                <div>
                    <label>Upload Image 1:</label>
                    <input
                        type="file"
                        onChange={(e) => handleImageChange(e, 'input1')}
                    />
                    {preview1 && <img src={preview1} alt='Preview 1' style={{ width: '100px', height: '100px', margin: '10px', marginLeft: '15px' }} />}
                </div>
                <div>
                    <label>Upload Image 2:</label>
                    <input
                        type="file"
                        onChange={(e) => handleImageChange(e, 'input2')}
                    />
                    {preview2 && <img src={preview2} alt='Preview 2' style={{ width: '100px', height: '100px', margin: '10px', marginLeft: '15px' }} />}
                </div>
                <div>
                    <label id='label'>Anonymous:</label>
                    <input type='checkbox' value={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                </div>
                <button id='createQuestionButton' onClick={createQuestion}>{isLoading ? 'Loading...' : 'Create Question'}</button>
            </div>
            <p id='error'>{cerror}</p>
        </div>
        </MobileView>
        </>
    )
}

export default CreateQuestion;