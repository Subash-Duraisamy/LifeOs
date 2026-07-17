import { useEffect, useState } from "react";

import "./MyLibrary.css";

import { useAuth } from "../../hooks/useAuth";

import LibraryItemCard from "./components/LibraryItemCard";
import LibraryModal from "./components/LibraryModal";

import {
  getLibrary,
  addLibraryItem,
  updateLibraryItem,
  deleteLibraryItem,
} from "../../services/libraryService";

function MyLibrary() {

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("books");

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] =
    useState(false);

  const [mode, setMode] =
    useState("add");

  const [selectedType, setSelectedType] =
    useState("book");

  const [selectedItem, setSelectedItem] =
    useState(null);

  useEffect(() => {

    if (user) {

      loadLibrary();

    }

  }, [user]);

  async function loadLibrary() {

    try {

      setLoading(true);

      const data =
        await getLibrary(user.uid);

      setItems(data);

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  }

  async function handleSave(data) {

    try {

      if (mode === "add") {

        await addLibraryItem(
          user.uid,
          {
            ...data,
            type: selectedType,
            order: items.length + 1,
          }
        );

      }

      else {

        await updateLibraryItem(
          selectedItem.id,
          data
        );

      }

      setOpenModal(false);

      setSelectedItem(null);

      loadLibrary();

    }

    catch (error) {

      console.error(error);

    }

  }

async function handleDelete(id) {

  if (!window.confirm("Delete this item?")) {
    return;
  }

  try {

    await deleteLibraryItem(id);

    await loadLibrary();

  }

  catch (error) {

    console.error(error);

  }

}

/* ==========================================
   FINISH CURRENT ITEM
========================================== */

async function handleComplete(item) {

  try {

    // Find the next item before deleting
    const nextItem = items
      .filter(i =>
        i.type === item.type &&
        !i.current &&
        i.id !== item.id
      )
      .sort((a, b) => a.order - b.order)[0];

    // Delete current item
    await deleteLibraryItem(item.id);

    // Promote next item as current
    if (nextItem) {

      await updateLibraryItem(
        nextItem.id,
        {
          current: true,
        }
      );

      // Shift remaining queue order
      const remainingItems = items
        .filter(i =>
          i.type === item.type &&
          !i.current &&
          i.id !== nextItem.id &&
          i.id !== item.id
        )
        .sort((a, b) => a.order - b.order);

      for (let index = 0; index < remainingItems.length; index++) {

        await updateLibraryItem(
          remainingItems[index].id,
          {
            order: index + 2,
          }
        );

      }

    }

    await loadLibrary();

  }

  catch (error) {

    console.error(error);

  }

}
async function moveUp(item) {

  const sameType = items
    .filter(i => i.type === item.type && !i.current)
    .sort((a, b) => a.order - b.order);

  const index = sameType.findIndex(i => i.id === item.id);

  if (index <= 0) return;

  const previous = sameType[index - 1];

  try {

    await updateLibraryItem(item.id, {
      order: previous.order,
    });

    await updateLibraryItem(previous.id, {
      order: item.order,
    });

    await loadLibrary();

  } catch (error) {

    console.error(error);

  }

}
async function moveDown(item) {

  const sameType = items
    .filter(i => i.type === item.type && !i.current)
    .sort((a, b) => a.order - b.order);

  const index = sameType.findIndex(i => i.id === item.id);

  if (index === sameType.length - 1) return;

  const next = sameType[index + 1];

  try {

    await updateLibraryItem(item.id, {
      order: next.order,
    });

    await updateLibraryItem(next.id, {
      order: item.order,
    });

    await loadLibrary();

  } catch (error) {

    console.error(error);

  }

}

  function openAdd(type) {

    setMode("add");

    setSelectedType(type);

    setSelectedItem(null);

    setOpenModal(true);

  }

  function openEdit(item) {

    setMode("edit");

    setSelectedType(item.type);

    setSelectedItem(item);

    setOpenModal(true);

  }

  const books =
    items.filter(
      item => item.type === "book"
    );

  const movies =
    items.filter(
      item => item.type === "movie"
    );

  const courses =
    items.filter(
      item => item.type === "course"
    );

  if (loading) {

    return (

      <div className="library-loading">

        Loading...

      </div>

    );

  }

  return (

    <div className="library-page">

      <div className="library-hero">

        {/* <div className="library-icon">

          📚

        </div> */}

        <div>

          {/* <h1>My Library</h1> */}

          <p>

            Manage your books, movies and
            courses in one place.

          </p>

        </div>

      </div>

      <div className="library-tabs">

        <button
          className={
            activeTab === "books"
              ? "library-tab active"
              : "library-tab"
          }
          onClick={() =>
            setActiveTab("books")
          }
        >

          📖 Books

        </button>

        <button
          className={
            activeTab === "movies"
              ? "library-tab active"
              : "library-tab"
          }
          onClick={() =>
            setActiveTab("movies")
          }
        >

          🎬 Movies

        </button>

        <button
          className={
            activeTab === "courses"
              ? "library-tab active"
              : "library-tab"
          }
          onClick={() =>
            setActiveTab("courses")
          }
        >

          🎓 Courses

        </button>

      </div>
            {/* ================= BOOKS ================= */}

      {activeTab === "books" && (

        <>

          {/* Current Book */}

          <section className="library-card">

            <div className="section-header">

              <h2>📖 Currently Reading</h2>

              <button
                className="add-btn"
                onClick={() => openAdd("book")}
              >
                + Add Book
              </button>

            </div>

            {

              books.filter(book => book.current).length === 0 ?

              (

                <div className="empty-box">

                  <h3>No Current Book</h3>

                  <p>
                    Start reading a new book.
                  </p>

                </div>

              )

              :

              books
                .filter(book => book.current)
                .map(book => (

                  <LibraryItemCard

                    key={book.id}

                    title={book.title}

                    image={book.image}

                    current={true}

                    onEdit={() => openEdit(book)}

                    onDelete={() =>
                      handleDelete(book.id)
                    }

                   onComplete={() => handleComplete(book)}

                  />

                ))

            }

          </section>

          {/* Upcoming Books */}

          <section className="library-card">

            <div className="section-header">

              <h2>📚 Next To Read</h2>

            </div>

            {

              books.filter(book => !book.current).length === 0 ?

              (

                <div className="empty-box">

                  <h3>No Upcoming Books</h3>

                  <p>
                    Add books to your reading queue.
                  </p>

                </div>

              )

              :

              books
                .filter(book => !book.current)
                .sort((a, b) => a.order - b.order)
                .map(book => (

                  <LibraryItemCard

                    key={book.id}

                    title={book.title}

                    image={book.image}

                    current={false}

                    onEdit={() => openEdit(book)}

                    onDelete={() =>
                      handleDelete(book.id)
                    }

onComplete={() => handleComplete(book)}

onMoveUp={() => moveUp(book)}

onMoveDown={() => moveDown(book)}

                  />

                ))

            }

          </section>

        </>

      )}
            {/* ================= MOVIES ================= */}

      {activeTab === "movies" && (

        <>

          {/* Current Movie */}

          <section className="library-card">

            <div className="section-header">

              <h2>🎬 Currently Watching</h2>

              <button
                className="add-btn"
                onClick={() => openAdd("movie")}
              >
                + Add Movie
              </button>

            </div>

            {

              movies.filter(movie => movie.current).length === 0 ?

              (

                <div className="empty-box">

                  <h3>No Current Movie</h3>

                  <p>
                    Add the movie you're currently watching.
                  </p>

                </div>

              )

              :

              movies
                .filter(movie => movie.current)
                .map(movie => (

                  <LibraryItemCard

                    key={movie.id}

                    title={movie.title}

                    image={movie.image}

                    current={true}

                    onEdit={() => openEdit(movie)}

                    onDelete={() =>
                      handleDelete(movie.id)
                    }

onComplete={() => handleComplete(movie)}
                  />

                ))

            }

          </section>

          {/* Watch Next */}

          <section className="library-card">

            <div className="section-header">

              <h2>🍿 Watch Next</h2>

            </div>

            {

              movies.filter(movie => !movie.current).length === 0 ?

              (

                <div className="empty-box">

                  <h3>No Upcoming Movies</h3>

                  <p>
                    Add movies to your watch list.
                  </p>

                </div>

              )

              :

              movies
                .filter(movie => !movie.current)
                .sort((a,b)=>a.order-b.order)
                .map(movie => (

                  <LibraryItemCard

                    key={movie.id}

                    title={movie.title}

                    image={movie.image}

                    current={false}

                    onEdit={() => openEdit(movie)}

                    onDelete={() =>
                      handleDelete(movie.id)
                    }

onComplete={() => handleComplete(movie)}
onMoveUp={() => moveUp(movie)}

onMoveDown={() => moveDown(movie)}

                  />

                ))

            }

          </section>

        </>

      )}
            {/* ================= COURSES ================= */}

      {activeTab === "courses" && (

        <>

          {/* Ongoing Course */}

          <section className="library-card">

            <div className="section-header">

              <h2>🎓 Ongoing Course</h2>

              <button
                className="add-btn"
                onClick={() => openAdd("course")}
              >
                + Add Course
              </button>

            </div>

            {

              courses.filter(course => course.current).length === 0 ?

              (

                <div className="empty-box">

                  <h3>No Ongoing Course</h3>

                  <p>
                    Continue your learning journey.
                  </p>

                </div>

              )

              :

              courses
                .filter(course => course.current)
                .map(course => (

                  <LibraryItemCard

                    key={course.id}

                    title={course.title}

                    image={course.image}

                    current={true}

                    onEdit={() => openEdit(course)}

                    onDelete={() =>
                      handleDelete(course.id)
                    }

onComplete={() => handleComplete(course)}

                  />

                ))

            }

          </section>

          {/* Next Courses */}

          <section className="library-card">

            <div className="section-header">

              <h2>📚 Next Courses</h2>

            </div>

            {

              courses.filter(course => !course.current).length === 0 ?

              (

                <div className="empty-box">

                  <h3>No Upcoming Courses</h3>

                  <p>
                    Add courses you want to learn next.
                  </p>

                </div>

              )

              :

              courses
                .filter(course => !course.current)
                .sort((a,b)=>a.order-b.order)
                .map(course => (

                  <LibraryItemCard

                    key={course.id}

                    title={course.title}

                    image={course.image}

                    current={false}

                    onEdit={() => openEdit(course)}

                    onDelete={() =>
                      handleDelete(course.id)
                    }

onComplete={() => handleComplete(course)}

onMoveUp={() => moveUp(course)}

onMoveDown={() => moveDown(course)}

                  />

                ))

            }

          </section>

        </>

      )}

      {/* ================= MODAL ================= */}

      <LibraryModal

        open={openModal}

        mode={mode}

        type={selectedType}

        item={selectedItem}

        onClose={() => {

          setOpenModal(false);

          setSelectedItem(null);

        }}

        onSave={handleSave}

      />

    </div>

  );

}

export default MyLibrary;