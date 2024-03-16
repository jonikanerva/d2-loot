import './Loading.css'

const Loading: React.FC = () => (
  <div className="loadingContainer">
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
)

export default Loading
