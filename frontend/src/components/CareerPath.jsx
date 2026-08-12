import { ArrowDown } from "lucide-react";

export default function CareerPath({ paths }) {
  return (
    <div className="path-container">

      {paths.slice(0, 3).map((path, index) => (
        <div className="path-card" key={index}>

          <div className="path-number">
            Path {index + 1}
          </div>

          <div className="path">

            {path.map((node, nodeIndex) => (
              <div key={nodeIndex} className="path-node">

                <div className="node">
                  {node}
                </div>

                {nodeIndex < path.length - 1 && (
                  <ArrowDown size={18} />
                )}

              </div>
            ))}

          </div>

        </div>
      ))}

    </div>
  );
}