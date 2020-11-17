import React from 'react'
import './OrderSelectionModal.scss'
import ItemCard from '../ItemCard'

export interface OrderSelectionModalInterface {
  showModal: boolean
  toggleModal: CallableFunction
  handleMenu: CallableFunction
}

const OrderSelectionModal: React.FC<OrderSelectionModalInterface> = (props) => {
  const { showModal, toggleModal, handleMenu } = props;
  const modal = document.getElementById("modal")!;

  const orderSelection = (type: string) => {
    if (type === 'Single') {
      toggleModal(false);
      handleMenu(false);
    } else if (type === 'Menu') {
      toggleModal(false);
      handleMenu(true);
    }
  }

  if(modal) {
    if (showModal) {
      modal.style.display = 'block';
    } else {
      modal.style.display = 'none';
    }
  }

  return (
    <div id="modal">
      <div className="modal-content">
        <h2>Select an option</h2>
        <div className="selection-box">
          <ItemCard 
            type='order selection'
            name='Single' 
            imgSrc='cheeseburger.jpg' 
            orderSelection={orderSelection}
          />
          <ItemCard 
            type='order selection'
            name='Menu' 
            imgSrc='frenchFries.jpg' 
            orderSelection={orderSelection}
          />
        </div>
        <button onClick={() => toggleModal(false)}>CANCEL</button>
      </div>
    </div>
  )
}

export default OrderSelectionModal