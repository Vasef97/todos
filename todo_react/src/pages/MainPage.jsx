import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import TodoContent from "../components/TodoContent";
import CreateListDialog from "../components/CreateListDialog";
import "../styles/MainPage.css";

export default function MainPage() {
  const [selectedList, setSelectedList] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleAddClick = () => setCreateOpen(true);
  const handleDialogClose = () => setCreateOpen(false);

  const handleCreated = newList => {
    setCreateOpen(false);
    setReloadKey(k => k + 1);
    setSelectedList(newList.id);
    setSelectedColor(newList.color);
  };

  return (
    <div className="main-container">
      <TopBar onAddClick={handleAddClick} />

      <div className="page-body">
        <Sidebar
          key={reloadKey}
          selectedId={selectedList}
          onSelect={(id, color) => {
            setSelectedList(id);
            setSelectedColor(color);
          }}
        />

        <div className="content-wrapper">
          <TodoContent
            selectedList={selectedList}
            colorCode={selectedColor}
          />
        </div>
      </div>

      <CreateListDialog
        open={createOpen}
        onClose={handleDialogClose}
        onCreated={handleCreated}
      />
    </div>
  );
}
