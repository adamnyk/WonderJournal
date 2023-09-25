import { Spinner } from "reactstrap"

const LoadingSpinner = () => {
    
    return (
        <div className="d-flex justify-content-around">
            <Spinner color='secondary' size='sm' className="ms-2"/>
        </div>
    )
}

export default LoadingSpinner