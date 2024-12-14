
const LinkWithIcon = ({
    icon,
    icontype,
    iconName,
    name,
}) => {
    return (
        <div className="linkWithIconVPWrapper">
            <div className="circleIconVP">
                <i className={icon + ' ' + icontype + ' ' + ' ' + iconName + ' ' + 'iconButtonVP'}></i>
            </div>

            <a href="#">
                {name}
            </a>

        </div>
    )
}

export default LinkWithIcon