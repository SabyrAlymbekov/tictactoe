interface props {
    gameName: string,
    photoURL: string
}

function GameCard({ photoURL, gameName }: props) {
    let avatarURL = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Sheba&backgroundType=gradientLinear";
    if (photoURL != "default") {
        avatarURL = photoURL as string;
    }
    return <div className="gameCard">
        <img src={avatarURL} alt="Image" className="gameCard-img" />
        <h1 className="gameCard-title">{gameName}</h1>
    </div>
}

export default GameCard