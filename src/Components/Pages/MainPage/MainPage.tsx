import React, { useState } from 'react';
import  { newItem, menuItem }  from '../../../App';
import * as Products from '../../../Utils/ProductItems'
import OrderDetails from '../../BottomOrderDetails/OrderDetails';
import ItemGrid from '../../ItemGrid/ItemGrid'
import OrderSelectionModal from '../../OrderSelectionModal/OrderSelectionModal'


export interface MainPageProps {
    addItemToOrder: (item: newItem) => void;
}
 
const MainPage: React.FC<MainPageProps> = (props: MainPageProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<menuItem>(Products.Burgers[0]);
    type categories = 'Burgers' | 'Drinks' | 'Sides' | 'Desserts';
    const [selectedCategory, setSelectedCategory] = useState<categories>('Burgers');

    const toggleModal = (toggle: boolean, item: menuItem) => {
        setShowModal(toggle);
        setSelectedItem(item);
    }

    const handleMenu = (isMenu: boolean) => {
      if(!isMenu) {
        props.addItemToOrder(selectedItem as unknown as newItem);
      }
    }
    
    return ( 
        <div>
            {/* <button onClick={()=>props.addItemToOrder(Burgers[1])}>Test</button> */}
            <button onClick={() => setSelectedCategory('Burgers')}>Burgers</button>
            <button onClick={() => setSelectedCategory('Drinks')}>Drinks</button>
            <button onClick={() => setSelectedCategory('Desserts')}>Desserts</button>
            <button onClick={() => setSelectedCategory('Sides')}>Sides</button>
            <ItemGrid 
                toggleModal={toggleModal} 
                addItemToOrder={props.addItemToOrder}
                category='Burgers' items={Products[selectedCategory]} />
            <OrderSelectionModal showModal={showModal} toggleModal={toggleModal} handleMenu={handleMenu} />
        </div>
     );
}
 
export default MainPage;