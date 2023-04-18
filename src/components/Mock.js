import React from 'react'
import { Viewer, Entity,EntityDescription,Clock,} from "resium";

const Mock = () => {
  return (
    <div class="md:flex flex-row h-screen">
      <div class="flex flex-col bg-white-300 top-0 left-0 rounded mx-1 my-1">
        <button class="bg-red-300 hover:bg-red-200 text-white rounded px-4 py-2 mx-1 my-1">
          Reset View
        </button>
        <button class="bg-green-300 hover:bg-green-200 text-white rounded px-4 py-2 mx-1 my-1">
          Thumbnail
        </button>
        <button class="bg-orange-300 hover:bg-orange-200 text-white rounded px-4 py-2 mx-1 my-1">
          Direction
        </button>
        <button class="bg-blue-300 hover:bg-blue-200 text-white rounded px-4 py-2 mx-1 my-1">
          WalkThrough
        </button>
      </div>
      <div class="h-screen w-screen">
        <Viewer
          animation={false}
          baseLayerPicker={false}
          fullscreenButton={false}
          vrButton={false}
          geocoder={false}
          homeButton={false}
          infoBox={false}
          sceneModePicker={false}
          selectionIndicator={false}
          timeline={false}
          navigationHelpButton={false}
          navigationInstructionsInitiallyVisible={false}
          automaticallyTrackDataSourceClocks={false}
          creditContainer={null}
          creditViewport={null}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default Mock
