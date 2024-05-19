// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function emailbody(data,category) {
  let categoryDetails = '';
  if (category === 'event') {
      categoryDetails = `
          Date : ${data.data_details[0].held_at}<br />
          Place : ${data.data_details[0].venue}<br />
      `;
  }
  
return `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
</style>

<div class="container" style="background: rgb(0,0,0);
background: linear-gradient(0deg, rgba(0,0,0,1) 17%, rgba(41,13,8,1) 21%, rgba(206,54,34,1) 30%, rgba(206,54,34,1) 77%, rgba(78,21,13,1) 80%, rgba(0,0,0,1) 85%); margin: 0; font-family: 'Poppins', sans-serif;">
  <div style="  color: white; margin: 0%; padding: 20px 30px 0px 30px ">
    <div style="margin: 0 auto; text-align: center; margin-bottom: 10px">
      <img src="https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/2.png" alt="" />
    </div>
    <h3 style="color: #ce3622">Hi, TEDxUII Audience!</h3>
    <p style="color: white; margin: 0">We're delighted to have you join us for our upcoming event, the centerpiece of TEDxUII, themed: Disruption Unlocking the Future</p>
    <br />
  </div>
  <div style="  padding: 0px 30px 20px 30px ;">
    <p style="color: white; margin: 0">
      Picture a world where innovation and imagination blend seamlessly, where the limitations of tradition fade away, and fresh challenges beckon us forth. Here, disruption isn't merely a disruption, but rather a catalyst—a mysterious
      force propelling us towards a future ripe with potential. It's a phenomenon that impels us to question the status quo, to dismantle entrenched norms, and to embrace uncertainty with unwavering curiosity.<br />
      <br />
      <br />

      Our goal is to invite our audience to explore the depths of disruptive innovation and discover how to wield its power for positive transformation in both personal and professional realms. Throughout our event, you will glean insights
      into emerging technologies, entrepreneurial mindsets, and transformative models poised to navigate the currents of change in the future landscape. <br />
      <br />
      <br />

      Our potential speakers : Suci Miranda, Zaki Habibi, Dhomas Hatta Fudholi, Fathul Wahid, Fahrudin Faiz, Zainal Arifin Muchtar, Gus Baha
    </p>
  </div>
  <div style=" padding: 0px 30px 20px 30px ; display: flex; justify-content: space-between">
    <div>
      <p style="color: white; margin: 0"><b>${capitalizeFirstLetter(category)} details :</b></p>
      <br />
      <p style="color: white; margin: 0">
        ID : ${data.id}<br />
        ${capitalizeFirstLetter(category)} Title: ${data.data_details[0].name}<br/>
        ${categoryDetails}
        Quantity : ${data.quantity}<br />
        Attendee : ${data.buyer_details[0].username}<br />
      </p>
    </div>
  </div>
  <div style=" padding: 0px 30px 20px 30px ;">
    <p style="color: white; margin: 0"><b>Thank you for join us</b></p>
  </div>
  <div style=" background-color: rgb(255, 255, 255); padding: 20px 30px 20px 30px;">
    <p style="color: #ce3622; margin: 0"><b>For more information - Contact us :</b></p>
    <br />
    <p style="color: #ce3622; margin: 0">
      <i>Email : tedxuiiyogyakarta@gmail.com <br>
         Social Media: Instagram: @tedxuii</i>
    </p>
  </div>
  <div style=" background-color:rgb(25, 24, 24); color: white; margin: 0%; padding: 0px 30px 20px 30px; height:20px; width:100%" >

  </div>
</div>
`

}
module.exports = {emailbody}