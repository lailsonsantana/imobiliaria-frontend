import PageHeader from "../../components/PageHeader";
import SideBar from "../../components/SideBar";


function Home(){
    return(
        <div>
            <PageHeader title={'Dashboard'} subtitle={'Imobiliária'} />
                
            <SideBar />


        </div>
    )
}

export default Home;