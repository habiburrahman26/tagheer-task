import WelcomeSVG from "../utils/welcomeSVG";
 
 
 function Welcome() {
  return (
    <div className="lg:col-span-2 lg:block bg-white">
      <div className="pl-5">
        <div dangerouslySetInnerHTML={{ __html: WelcomeSVG }} />
        <div className="text-center">
          <h2 className="text-xl text-gray-500">
            Select a Chat to Start Messaging
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Welcome