// Seed file used to seed database with books provided in text file
const Book = require("../models/Book");
const mongoose = require("mongoose");
const db = require("../config/keys").mongoURI;

const books = [
    new Book({
        title: "28 SUMMERS",
        author_publisher: "by Elin Hilderbrand | Little, Brown",
        description: "A relationship that started in 1993 between Mallory Blessing and Jake McCloud comes to light while she is on her deathbed and his wife runs for president.",
        cover: "https://s1.nyt.com/du/books/images/9780316420044.jpg",
    }),
    new Book({
        title: "WHERE THE CRAWDADS SING",
        author_publisher: "by Delia Owens | Putnam",
        description: "In a quiet town on the North Carolina coast in 1969, a young woman who survived alone in the marsh becomes a murder suspect.",
        cover: "https://s1.nyt.com/du/books/images/9780735219090.jpg",
    }),
    new Book({
        title: "CAMINO WINDS",
        author_publisher: "by John Grisham | Doubleday",
        description: "The line between fact and fiction becomes blurred when an author of thrillers is found dead after a hurricane hits Camino Island.",
        cover: "https://s1.nyt.com/du/books/images/9780385545938.jpg",
    }),
    new Book({
        title: "THE VANISHING HALF",
        author_publisher: "by Brit Bennett | Riverhead",
        description: "The lives of twin sisters who run away from a Southern black community at age 16 diverge as one returns and the other takes on a different racial identity but their fates intertwine.",
        cover: "https://s1.nyt.com/du/books/images/9780525536291.jpg",
    }),
    new Book({
        title: "THE SUMMER HOUSE",
        author_publisher: "by James Patterson and Brendan DuBois | Little, Brown",
        description: "Jeremiah Cook, a veteran and former N.Y.P.D. cop, investigates a mass murder near a lake in Georgia.",
        cover: "https://s1.nyt.com/du/books/images/9780316539555.jpg",
    }),
    new Book({
        title: "IF IT BLEEDS",
        author_publisher: "by Stephen King | Scribner",
        description: "Four novellas: “Mr. Harrigan’s Phone,” “The Life of Chuck,” “Rat” and “If It Bleeds.”",
        cover: "https://s1.nyt.com/du/books/images/9781982137977.jpg",
    }),
    new Book({
        title: "DEACON KING KONG",
        author_publisher: "by James McBride | Riverhead",
        description: "In 1969, secrets in a South Brooklyn neighborhood are uncovered when a church deacon known as Sportcoat shoots a drug dealer in public.",
        cover: "https://s1.nyt.com/du/books/images/9780735216723.jpg",
    }),
    new Book({
        title: "FAIR WARNING",
        author_publisher: "by Michael Connelly | Little, Brown",
        description: "The third book in the Jack McEvoy series. A reporter tracks a killer who uses genetic data to pick his victims.",
        cover: "https://s1.nyt.com/du/books/images/9780316539425.jpg",
    }),
    new Book({
        title: "THE GUEST LIST",
        author_publisher: "by Lucy Foley | Morrow",
        description: "A wedding between a TV star and a magazine publisher on an island off the coast of Ireland turns deadly.",
        cover: "https://s1.nyt.com/du/books/images/9780062868930.jpg",
    }),
    new Book({
        title: "DEVOLUTION",
        author_publisher: "by Max Brook | Del Rey",
        description: "In the aftermath of Mount Rainier erupting, Kate Holland’s newly discovered journals tell the tale of the creature known as Bigfoot.",
        cover: "https://s1.nyt.com/du/books/images/9781984826787.jpg",
    })
]

//connect mongoose
mongoose
    .connect(db, { useUnifiedTopology: true }, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));


books.map(async (p, index) => {
    await p.save((err, result) => {
        if (index === books.length - 1) {
            console.log("DONE!");
            mongoose.disconnect();
        }
    });
});