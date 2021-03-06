import React from 'react';
import logo from '../../images/curious_cat.png';
import aBook from '../../images/testbook.png';
import bBook from '../../images/anotherbook.png';
import api from '../../backend/backend';
import queryString from 'query-string';
import TextTruncate from 'react-text-truncate'; // recommend
import ReactLoading from 'react-loading';
import {TinyButton as ScrollUpButton} from "react-scroll-up-button"; //Add this line Here

class Search extends React.Component {	
    constructor(props) {
        super(props);
      
      this.state = {
        bookname:'',
        course:'',
        token:false,
        loaded:false,
        loading:false,
        message:[],
      };
      this.storageUpdated = this.storageUpdated.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    UNSAFE_componentWillMount() {
      this.getParams();
      }
      getParams(){
      const values = queryString.parse(this.props.location.search);
      let book = values.bname;
      let course = values.course;
      this.setState({bookname:book,course:course},() => this.search());
      }
    storageUpdated() {
      if (window.localStorage.getItem("token") !== this.state.token) {
        this.setState({
          token: window.localStorage.getItem("token"),
          user: JSON.parse(window.localStorage.getItem("currentUser"))
        });
      }
    }
  
    handleChange(event) {
      this.setState({
        [event.target.id]: event.target.value
      });
    }
    handleSubmit(event) {
      event.preventDefault();
      console.log(this.state.course);
      console.log(this.state.bookname);
    }
    goTo(event) {
        const value = "post/"+ event;
        this.props.history.push(`/${value}`);
      }
    loadBoxes(){
      console.log(this.state)
	let boxes = []
	for (let i =0; i< this.state.message.length; i++) {

		boxes.push(
        <div className="max-w-sm mx-auto md:mr-4 md:ml-4 rounded-lg font-bold" onClick={(e)=> this.goTo(this.state.message[i].postID)}>
            <div className="w-full sm:w-full lg:w-full py-6 ">
                <div className="bg-white w-64 shadow-2xl rounded-lg rounded cursor-pointer">
                    <div className="bg-cover bg-center justify-center flex h-56 p-4 w-auto overflow-hidden">
                      <img className="rounded h-full" src={this.state.message[i].image !== "null" && this.state.message[i].image !== null?  this.state.message[i].image:logo}></img>
                    </div>
                    <div className="overflow-auto uppercase tracking-wide text-sm font-bold text-gray-700 mb-2">
                    <TextTruncate
                        line={1}
                        element="span"
                        truncateText="…"
                        text={this.state.message[i].title}
                    /> 
                        <p className="text-3xl text-gray-900 mb-2">{"$"+this.state.message[i].price}</p>
                        <p className="text-gray-700"> {this.state.message[i].author}</p>
                   </div>
                    <div className="flex justify-between p-4 border-t border-solid border-gray-300 text-gray-700">
                        <div className="flex pt-1 just">
                            <svg className="h-6 w-6 text-gray-600 fill-current "/>
                            <p className="text-black text-lg whitespace-no-wrap"> {this.state.message[i].condition}</p>                     
                        </div>
                        <div className="flex items-center">
                            <svg className="h-6 w-6 text-gray-600 fill-current"/>
                            {
                            this.state.message[i].hold === 0? 
                            <p className="text-green-500 text-lg"> Available</p>
                            :
                            <p className="text-red-500 text-lg"> On Hold</p>
                            }
                        </div>
                    </div>
                    <div className="border-b border-solid rounded-lg rounded-t-none px-4 pt-3 pb-4 border-t border-gray-300 bg-gray-100">
                        <div className="text-xs uppercase font-bold text-gray-600 tracking-wide">Seller</div>
                        <div className="flex justify-center items-center pt-2">
                            <div>
                                <p className="font-bold text-gray-900">{this.state.message[i].firstname + " " + this.state.message[i].surname}</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>)};
    return boxes;
      }
      search() {
        const bname = this.state.bookname === undefined? '':this.state.bookname.replace(/\s/g, ' ');
        const course = this.state.course === undefined? '':this.state.course.replace(/\s/g, '');
        this.setState({message:[],loaded:false});
        this.props.history.push(`/search?bname=${bname}&course=${course}`);

        if(bname || course) {
          console.log(bname);
          console.log(course);
        let querystring = `?bname=${bname}`
        +`&course=${course}`;
        console.log(querystring);
        this.setState({loading:true})
        fetch(api+"/testapi/search" +querystring, {
          method: "GET",
          headers: {
            'accept': 'application/json',
          }
        })
        .then(function (response) {
          console.log("hi");
            return response.json();
        })
        .then(function (data) {
            if (data["error"]) {
                this.setState({
                    error: data["message"],
                    loading:false
                });
                console.log(data);
            }
            else {
              console.log(data);
                this.setState({message:data});
                this.setState({loaded:true,loading:false});
                console.log(this.state);
            }
    
        }.bind(this));
         
        } 
      }
	render() {
    	return (
        <div className="text-center bg-blue-new items-center justify-center align-start w-full flex font-sans-pro  overflow-auto  md:pl-10 md:pr-10">
          <div className="w-full h-full md:mt-4 mt-8 overflow-auto  ">
          <div className="bg-white">
            <ScrollUpButton    
            style={{backgroundColor:"white", fill:"#88C5CC"}}
            />
          </div>
          {window.innerWidth < 768 &&
          <div className="items-center justify-center flex">
        <div className="bg-white w-2/3 border rounded p-4">
        <input
        className="md:text-xl md:w-auto w-3/4 md:h-14 mb-2 shadow-xl font-sans-pro text-grey-darker border-2 border-blue-new font-bold rounded text-center focus:shadow-inner"
         placeholder="Search by Name"
         id="bookname"
         type="text"
         value={this.state.bookname}
         onChange={this.handleChange}
       />
     <div className ="md:ml-4 md:mr-4 md:pt-4 mt-2 mb-2 text-2xl leading-none font-sans-pro font-bold" >OR</div>

       <input
       className="p-4 md:text-xl mt-2 md:w-auto md:h-14 shadow-xl  border-2 border-blue-new font-sans-pro text-grey-darker rounded font-bold text-center focus:shadow-inner"
         placeholder="Search by Course"
         id ="course"
         value={this.state.course}
         type="text"
         onChange={this.handleChange}
       />
     <div className="mt-4 flex justify-center ">
     <div className="w-1/2 bg-blue-new hover:bg-teal-600 h-14 text-2xl hover:bg-blue text-white font-bold font-sans-pro py-4 px-4 rounded cursor-pointer" onClick={() => this.search()} value="Search">Search</div>
     </div>
     </div>
     </div>

    }
            <div className="md:pt-10 overflow-auto ">
            {
              this.state.loaded &&
              <div className="flex flex-wrap overflow-auto justify-center">
              {this.loadBoxes()}
              </div>}
              {this.state.loaded && this.state.message.length == 0 &&
              <div className="flex flex-wrap justify-center">
              <div className="md:w-1/2 w-full h-64 m-4 p-10 bg-white rounded shadow-xl font-bold items-center text-center justify-center">
                <p className="text-red-500 text-xl font-bold font-sans-pro"> No search results loaded for your query. <br></br> Please try another search.</p>
              </div>
              </div>}
              {
                this.state.loading === true &&
                <div className="flex justify-center items-center w-full h-full">
              <ReactLoading type={"bars"} color={"#fff"} height={'20%'} width={'20%'} />
              </div>
              }
            </div>  
          </div>
        </div>
		)	
	}
}

export default Search;
