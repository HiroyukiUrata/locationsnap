import { Viewer, Entity,EntityDescription,Clock,} from "resium";
import { Cartesian3,Rectangle,Color,HorizontalOrigin,VerticalOrigin,JulianDate,Quaternion,Math,HeadingPitchRoll,SampledPositionProperty,VelocityOrientationProperty,Transforms,Model,TimeInterval,TimeIntervalCollection,PathGraphics} from "cesium";
import { useState,useEffect,useRef } from "react";
import Wareki from "./Wareki";
import Loading from "./Loading";


const LocationSnap = () => {
 
  const viewerRef = useRef();
  const [billboardshown, setBillboardshown] = useState({});
  const [cylindershown, setCylindershown] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState();

  const positionProperty = new SampledPositionProperty();//フライトパス用
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        //API:supabaseでデータフェッチ
        const res = await fetch('/api/supabase');
        const data = await res.json();
        
        setRecords(data);
        setLoading(false); // ローディングアイコンを非表示にする
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();

  }, []);

  useEffect(() => {
    async function handleZoomWithRecords() {
      // records を使った非同期処理を実行する
      // ズーム処理を実行する
      handleZoom();
      setLoading(false); // ローディングアイコンを非表示にする
    }
    if (records && records.length > 0) {
      handleZoomWithRecords();
    }
  }, [records]);

  const createEntity = (record) => {
    
    // エンティティを北向きに向けるためのクォータニオンを作成する
    var orientation = Quaternion.fromHeadingPitchRoll(
      new HeadingPitchRoll(
        Math.toRadians(0), // 方位角を0度に設定（北向き）
        Math.toRadians(-90), // 仰角を-90度に設定（地面に対して平行）
        Math.toRadians(0) // ロールを0度に設定（傾きなし）
      )
    );

    // エンティティのorientationプロパティに設定するクォータニオンを作成する
    var rotationZ = Quaternion.fromAxisAngle(Cartesian3.UNIT_Z,Math.toRadians(0));
    var rotationY = Quaternion.fromAxisAngle(Cartesian3.UNIT_Y,Math.toRadians(180 - record.direction));
    var rotationX = Quaternion.fromAxisAngle(Cartesian3.UNIT_X,Math.toRadians(0)   );
    var direction = Quaternion.multiply(rotationX,Quaternion.multiply(rotationY, rotationZ, new Quaternion()),orientation);

    // フライトパス用のデータをセット
    const time = JulianDate.fromIso8601(record.timestamp);
    const position = Cartesian3.fromDegrees(record.geom.coordinates[0], record.geom.coordinates[1], 0);
    positionProperty.addSample(time,position)
    
    return (
      <Entity
        name={record.filename}
        key={record.id}
        position={Cartesian3.fromDegrees(
          record.geom.coordinates[0],
          record.geom.coordinates[1],
          0
        )}
        point={{ pixelSize: "10", color: Color.RED }}
        billboard={{
          image: "data:image/png;base64," + record.base64image,
          scale: 2,
          width: 30,
          height: 30,
          eyeOffset: new Cartesian3(0.0, 0.0, 0.0),
          horizontalOrigin: HorizontalOrigin.CENTER,
          verticalOrigin: VerticalOrigin.BOTTOM,
          // show:true,
          show: billboardshown[record.id] || false,
        }}
        //Entityもしくはシリンダーを傾けたい
        orientation={direction}
 
        cylinder={{
          length: 10,
          topRadius: 1,
          bottomRadius: 5,
          material: Color.ORANGE.withAlpha(0.2),
          show:cylindershown[record.id]||false,
        }}
      >
        <EntityDescription>
          <p>
            <Wareki datetime={new Date(record.timestamp)} />
          </p>
          <img src={"data:image/png;base64," + record.base64image}></img>
  
        </EntityDescription>
      </Entity>
    );
  };

  function toggleBillboard(id) {
    setBillboardshown((prevShowState) => {
      const newState = { ...prevShowState };
      newState[id] = !newState[id];
      return newState;
    });
  }
  
  function toggleAllBillboard(id) {
    records.map((record) => toggleBillboard(record.id));
  }
  
  function toggleCylinder(id) {
    setCylindershown((prevShowState) => {
      const newState = { ...prevShowState };
      newState[id] = !newState[id];
      return newState;
    });
  }

  function toggleAllCylinder(id) {
    records.map((record) => toggleCylinder(record.id));
  }

  const handleZoom = () => {
    const viewer = viewerRef.current.cesiumElement;
    // const entities = viewer.entities.values;
    
    const rectangle = Rectangle.fromCartesianArray(
      records.map((record) =>
        Cartesian3.fromDegrees(
          record.geom.coordinates[0],
          record.geom.coordinates[1]
        )
      )
    );
    const offsetlevel = 1.1;
    const center = Rectangle.center(rectangle);
    const newRectangle = new Rectangle(
      center.longitude - rectangle.width * offsetlevel,
      center.latitude - rectangle.height * offsetlevel,
      center.longitude + rectangle.width * offsetlevel,
      center.latitude + rectangle.height * offsetlevel
    );
    const destination = newRectangle.clone();
    viewer.camera.flyTo({
      destination: destination,
      duration: 0,
    });
 
  };


  function startTrace(){
    const viewer = viewerRef.current.cesiumElement;
     
    const samples = positionProperty._property._times; // サンプル配列を取得
    const oldestSample = samples[0]; // 最初のサンプルを取得
    const newestSample = samples[samples.length - 1];

    const airplaneLine=<Entity
    availability={new TimeIntervalCollection([new TimeInterval({start:oldestSample,stop:newestSample})])}
    position={positionProperty}
    model={{
      uri:'stickman.gltf',
      minimumPixelSize:100,
      // maximamScale:2000,
      outlineColor:Color.WHITE
    }}
    orientation={new VelocityOrientationProperty(positionProperty)}
    path={new PathGraphics({width:2})}
    // tracked
    // selected
    />

    const clock = (
      <Clock
      startTime={oldestSample}
      stopTime={newestSample}
      currentTime={oldestSample}
      multiplier={100}
      shouldAnimate={true}
    >

      {airplaneLine}
    </Clock>      
    )
    setClock(clock);
    //TODO:クォータービュー
  }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div class="md:flex flex-row h-screen">
      {loading && <Loading />}
      {!loading && (
        <>
          <div class="flex flex-col bg-white-300 top-0 left-0 rounded mx-1 my-1">
            <button
              class="bg-red-300 hover:bg-red-200 text-white rounded px-4 py-2 mx-1 my-1"
              onClick={handleZoom}
            >
              Reset View
            </button>
            <button
              class="bg-green-300 hover:bg-green-200 text-white rounded px-4 py-2 mx-1 my-1"
              onClick={toggleAllBillboard}
            >
              Thumbnail
            </button>
            <button
              class="bg-orange-300 hover:bg-orange-200 text-white rounded px-4 py-2 mx-1 my-1"
              onClick={toggleAllCylinder}
            >
              Direction
            </button>
            <button
              class="bg-blue-300 hover:bg-blue-200 text-white rounded px-4 py-2 mx-1 my-1"
              onClick={startTrace}
            >
              WalkThrough
            </button>
          </div>

          <div class="h-screen w-screen">
            <Viewer
              ref={viewerRef}
              vrButton={false}
              geocoder={false}
              homeButton={false}
              // infoBox={false}
              sceneModePicker={false}
              selectionIndicator={false}
              timeline={false}
              // navigationHelpButton={false}
              // navigationInstructionsInitiallyVisible={false}
              // automaticallyTrackDataSourceClocks={false}
              creditContainer={null}
              // creditViewport={null}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              {records ? (
                <div>
                  {records.map((record) => createEntity(record))}
                  {clock}
                </div>
              ) : (
                <div></div>
              )}
            </Viewer>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationSnap;
