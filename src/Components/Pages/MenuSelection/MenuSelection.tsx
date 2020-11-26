import React, { useState, useContext, useRef, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import './MenuSelection.scss'
import { MenuItem } from '../../../App'
import ItemCard from '../../ItemCard/ItemCard'
import { Sides, Drinks } from '../../../Utils/ProductItems'
import { ControlledComponentContext } from '../../../Contexts/ControlledComponentContext'

interface MenuSelectionProps {
    selectedItem: MenuItem;
    addItemToOrder: CallableFunction;
}

const MenuSelection: React.FC<MenuSelectionProps> = (props) => {
    const { selectedItem, addItemToOrder } = props;
    const { controlled, setControlled } = useContext(ControlledComponentContext);
    const [highlightedDiv, setHighlightedDiv] = useState(0);
    const [highlightedDrink, setHighlightedDrink] = useState(0);
    const [highlightedSide, setHighlightedSide] = useState(0);
    const [selectedDrink, setSelectedDrink] = useState<MenuItem>();
    const [selectedSide, setselectedSide] = useState<MenuItem>();
    const history = useHistory();
    const drinksContainer = document.getElementById('drinks-container');
    const sidesContainer = document.getElementById('sides-container');
    const mainDiv = useRef<HTMLDivElement>(null);
    const drinksDiv = useRef<HTMLDivElement>(null);
    const sidesDiv = useRef<HTMLDivElement>(null);
    const addBtnRef = useRef<HTMLButtonElement>(null);
    const divArray = useMemo(() => [mainDiv, drinksDiv, sidesDiv, addBtnRef], [mainDiv, drinksDiv, sidesDiv, addBtnRef])

    const addMenuToOrder = () => {
        if(selectedDrink && selectedSide) {
            let newMenu = { burger: selectedItem, drink: selectedDrink, side: selectedSide, type: 'menu' }
            addItemToOrder(newMenu);
            history.push('/mainpage');
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(drinksDiv.current && sidesDiv.current && addBtnRef.current) {
                const drinks = drinksDiv.current.children;
                const sides = sidesDiv.current.children;
                const addBtn = addBtnRef.current;
                const divNum = highlightedDiv;
                const drinkNum = highlightedDrink;
                const sideNum = highlightedSide;
            
                switch(e.key) {
                    case 'ArrowUp':
                        if(highlightedDiv > 0) {
                            setHighlightedDiv(divNum - 1);
                        } else if(highlightedDiv === 0) {
                            // Change to back button
                        }
                        break;
                    case 'ArrowDown':
                        if((divArray[highlightedDiv] === sidesDiv && addBtn.classList.contains('disabled-link')) || highlightedDiv === divArray.length - 1) {
                            setControlled('orderDetails');
                        } else if(highlightedDiv < divArray.length - 1) {
                            setHighlightedDiv(divNum + 1);
                        }
                        break;
                    case 'ArrowLeft':
                        if(divArray[highlightedDiv] === drinksDiv) {
                            if(drinkNum > 0) {
                                setHighlightedDrink(drinkNum - 1);
                                drinksContainer?.scrollBy({
                                    top: 0,
                                    left: -200,
                                    behavior: 'smooth'
                                })
                            }
                        } else if(divArray[highlightedDiv] === sidesDiv) {
                            if(sideNum > 0) {
                                setHighlightedSide(sideNum - 1);
                                sidesContainer?.scrollBy({
                                    top: 0,
                                    left: -200,
                                    behavior: 'smooth'
                                })
                            }
                        }
                        break;
                    case 'ArrowRight':
                        if(divArray[highlightedDiv] === drinksDiv) {
                            if(drinkNum < drinks.length - 1) {
                                setHighlightedDrink(drinkNum + 1);
                                if(drinkNum > 2) {
                                    drinksContainer?.scrollBy({
                                        top: 0,
                                        left: 200,
                                        behavior: 'smooth'
                                    })
                                }
                            }
                        } else if(divArray[highlightedDiv] === sidesDiv) {
                            if(sideNum < sides.length - 1) {
                                setHighlightedSide(sideNum + 1);
                                if(sideNum > 2) {
                                    sidesContainer?.scrollBy({
                                        top: 0,
                                        left: 200,
                                        behavior: 'smooth'
                                    })
                                }
                            }
                        }
                        break;
                    case 'Enter':
                        if(divArray[highlightedDiv] === drinksDiv) {
                            setSelectedDrink(Drinks[highlightedDrink]);
                        } else if(divArray[highlightedDiv] === sidesDiv) {
                            setselectedSide(Sides[highlightedSide]);
                        } else if(divArray[highlightedDiv] === addBtnRef) {
                            addBtn.click();
                            setControlled('category');
                        }
                        break;
                }
            }
        }
        if(controlled === 'menuSelection') {
            window.addEventListener('keydown', handleKeyDown);    
        }
        return () =>
            window.removeEventListener('keydown', handleKeyDown);
    }, 
    [
        controlled, 
        setControlled, 
        divArray, 
        drinksDiv, 
        sidesDiv, 
        addBtnRef, 
        highlightedDiv, 
        setHighlightedDiv, 
        setHighlightedDrink, 
        setHighlightedSide, 
        drinksContainer, 
        sidesContainer,
        highlightedDrink,
        highlightedSide
    ])

    useEffect(() => {
        if(controlled !== 'menuSelection' && controlled !== 'orderDetails' && controlled !== 'cancelModal') {
            setHighlightedDiv(0);
            setHighlightedDrink(0);
            setHighlightedSide(0);
        }

        if(mainDiv.current && drinksDiv.current && sidesDiv.current && addBtnRef.current) {
            const main = mainDiv.current.children;
            const drinks = drinksDiv.current.children;
            const sides = sidesDiv.current.children;
            const addBtn = addBtnRef.current;
            const drinkNum = highlightedDrink;
            const sideNum = highlightedSide;

            if(controlled === 'menuSelection') {
                if(divArray[highlightedDiv] === mainDiv) {
                    drinks[drinkNum].classList.remove('highlighted');
                    sides[sideNum].classList.remove('highlighted');
                    addBtn.classList.remove('highlighted');
                    main[0].classList.add('highlighted');
                } else if(divArray[highlightedDiv] === drinksDiv) {
                    sides[sideNum].classList.remove('highlighted');
                    addBtn.classList.remove('highlighted');
                    main[0].classList.remove('highlighted');
                    
                    for(let i = 0; i < drinks.length; i++) {
                        if(drinkNum === i) {
                            drinks[i].classList.add('highlighted');
                        } else {
                            drinks[i].classList.remove('highlighted');
                        }
                    }

                } else if(divArray[highlightedDiv] === sidesDiv) {
                    drinks[drinkNum].classList.remove('highlighted');
                    addBtn.classList.remove('highlighted');
                    main[0].classList.remove('highlighted');
                    
                    for(let j = 0; j < sides.length; j++) {
                        if(sideNum === j) {
                            sides[j].classList.add('highlighted');
                        } else {
                            sides[j].classList.remove('highlighted');
                        }
                    }

                } else if(highlightedDiv === 10) {
                    drinks[drinkNum].classList.remove('highlighted');
                    sides[sideNum].classList.remove('highlighted');
                    addBtn.classList.remove('highlighted');
                    main[0].classList.remove('highlighted');
                } else if(divArray[highlightedDiv] === addBtnRef) {
                    drinks[drinkNum].classList.remove('highlighted');
                    sides[sideNum].classList.remove('highlighted');
                    main[0].classList.remove('highlighted');
                    addBtn.classList.add('highlighted');
                }
            } else {
                drinks[drinkNum].classList.remove('highlighted');
                sides[sideNum].classList.remove('highlighted');
                main[0].classList.remove('highlighted');
                addBtn.classList.remove('highlighted');
            }

        }
    }, 
    [
        controlled, 
        divArray, 
        highlightedDiv, 
        setHighlightedDiv, 
        mainDiv, 
        drinksDiv, 
        sidesDiv, 
        addBtnRef, 
        setHighlightedDrink, 
        setHighlightedSide,
        highlightedDrink,
        highlightedSide
    ])

    return (
        <div>
            <div className="headline-text">Main</div>
            <div className="item-container">
                <div className="item-scroll-container" ref={mainDiv}>
                    <ItemCard 
                        type='item' 
                        scale={190}
                        name={selectedItem.name} 
                        imgSrc={selectedItem.imgSrc}
                        price={selectedItem.price}
                        item={selectedItem}
                        selectedItem={selectedItem?.name}
                    />
                </div>
            </div>
            
            <div className="headline-text">Drinks</div>
            <div className="item-container" id='drinks-container'>
                <div className="item-scroll-container" ref={drinksDiv}>
                    { Drinks.map((item, key) => {
                        return (
                            <ItemCard 
                                key={key}
                                type='item'
                                scale={190}
                                name={item.name}
                                imgSrc={item.imgSrc}
                                price={item.price}
                                item={item}
                                setSelectedItem={setSelectedDrink}
                                selectedItem={selectedDrink?.name}
                            />
                        )
                    })}
                </div>
            </div>

            <div className="headline-text">Sides</div>
            <div className="item-container" id='sides-container'>
                <div className="item-scroll-container" ref={sidesDiv}>
                    { Sides.map((item, key) => {
                        return (
                            <ItemCard 
                                key={key}
                                type='item'
                                scale={190}
                                name={item.name}
                                imgSrc={item.imgSrc}
                                price={item.price}
                                item={item}
                                setSelectedItem={setselectedSide}
                                selectedItem={selectedSide?.name}
                            />
                        )
                    })}      
                </div>
            </div>
            <button 
                id='add-button' 
                className={(selectedDrink && selectedSide)? '' : 'disabled-link'} 
                ref={addBtnRef}
                onClick={addMenuToOrder}
            >
                Add to order
            </button>
        </div>
    )
}

export default MenuSelection